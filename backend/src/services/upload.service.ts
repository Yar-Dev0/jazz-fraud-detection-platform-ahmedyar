import { PrismaClient, Prisma } from "@prisma/client";
import { FraudService } from "./fraud.service";
import { transactionSchema } from "../validations/transaction.schema";
import { parseCsvFile } from "../utils/csv.parser";
import { UploadSummary } from "../types/api.types";

const prisma = new PrismaClient();

export class UploadService {
  public static async processCsvFile(filePath: string): Promise<UploadSummary> {
    const parsed = await parseCsvFile(filePath);

    let inserted = 0;
    let duplicates = 0;
    let invalidRows = 0;
    let highRisk = 0;
    let suspicious = 0;

    await prisma.$transaction(async (tx) => {
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
          tx as unknown as Prisma.TransactionClient,
          data
        );

        await tx.transaction.create({
          data: {
            ...data,
            amount: data.amount,
            timestamp: new Date(data.timestamp),
            risk_flag: fraudResult.risk_flag,
            rule_triggered: fraudResult.rule_triggered,
          },
        });

        inserted += 1;

        if (fraudResult.risk_flag === "HIGH_RISK") {
          highRisk += 1;
        } else if (fraudResult.risk_flag === "SUSPICIOUS") {
          suspicious += 1;
        }
      }
    });

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