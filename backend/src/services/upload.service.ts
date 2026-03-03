import { PrismaClient, Prisma } from "@prisma/client";
import { FraudService } from "./fraud.service";
import { transactionSchema } from "../validations/transaction.schema";
import { parseCsvFile } from "../utils/csv.parser";
import { UploadSummary } from "../types/api.types";
import { promises as fs } from "fs";

const prisma = new PrismaClient();

export class UploadService {
  public static async processMultipleFiles(
    files: Express.Multer.File[]
  ): Promise<UploadSummary[]> {
    const summaries: UploadSummary[] = [];

    for (const file of files) {
      const summary = await this.processCsvFile(file.path);
      summaries.push(summary);
    }

    return summaries;
  }

  public static async processCsvFile(filePath: string): Promise<UploadSummary> {
    const parsed = await parseCsvFile(filePath);

    let inserted = 0;
    let duplicates = 0;
    let invalidRows = 0;
    let highRisk = 0;
    let suspicious = 0;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const row of parsed.rows) {
        const parseResult = transactionSchema.safeParse({
          transaction_id: row.transaction_id,
          user_id: row.user_id,
          amount: Number(row.amount),
          timestamp: row.timestamp,
          device_id: row.device_id,
        });

        if (!parseResult.success) {
          invalidRows += 1;
          continue;
        }

        const data = parseResult.data;

        const existing = await tx.transaction.findUnique({
          where: { transaction_id: data.transaction_id },
        });

        if (existing) {
          duplicates += 1;
          continue;
        }

        const fraudResult = await FraudService.evaluateTransaction(
          tx,
          data
        );

        const primaryRiskFlag = fraudResult.risk_flags.includes("HIGH_RISK")
          ? "HIGH_RISK"
          : fraudResult.risk_flags.includes("SUSPICIOUS")
          ? "SUSPICIOUS"
          : "NORMAL";

        await tx.transaction.create({
          data: {
            ...data,
            amount: data.amount,
            timestamp: new Date(data.timestamp),
            risk_flag: primaryRiskFlag,
            risk_flags: fraudResult.risk_flags.join(","),
            rule_triggered: fraudResult.rule_triggered,
          },
        });

        inserted += 1;

        if (fraudResult.risk_flags.includes("HIGH_RISK")) {
          highRisk += 1;
        }
        if (fraudResult.risk_flags.includes("SUSPICIOUS")) {
          suspicious += 1;
        }
      }
    });

    // Delete the file after successful processing
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
      // Don't throw error - continue even if file deletion fails
    }

    return {
      file_name: parsed.fileName,
      total_rows: parsed.totalRows,
      total_columns: parsed.totalColumns,
      inserted,
      duplicates,
      invalid_rows: invalidRows,
      high_risk: highRisk,
      suspicious,
    };
  }
}