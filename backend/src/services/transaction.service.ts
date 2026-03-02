import { PrismaClient, Prisma } from "@prisma/client";
import { FraudService } from "./fraud.service";
import {
  DashboardStats,
  TransactionInput,
  TransactionRecord,
} from "../types/api.types";

const prisma = new PrismaClient();

export class TransactionService {
  public static async createTransaction(
    input: TransactionInput
  ): Promise<TransactionRecord> {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { transaction_id: input.transaction_id },
      });

      if (existing) {
        const error = new Error("Transaction with this ID already exists") as Error & {
          status?: number;
        };
        error.status = 409;
        throw error;
      }

      const fraudResult = await FraudService.evaluateTransaction(
        tx as unknown as Prisma.TransactionClient,
        input
      );

      const created = await tx.transaction.create({
        data: {
          ...input,
          timestamp: new Date(input.timestamp),
          risk_flag: fraudResult.risk_flag,
          rule_triggered: fraudResult.rule_triggered,
        },
      });

      return created as unknown as TransactionRecord;
    });
  }

  public static async listTransactions(): Promise<TransactionRecord[]> {
    const transactions = await prisma.transaction.findMany({
      orderBy: { timestamp: "desc" },
    });
    return transactions as unknown as TransactionRecord[];
  }

  public static async getDashboardStats(): Promise<DashboardStats> {
    const [total, highRisk, suspicious] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({ where: { risk_flag: "HIGH_RISK" } }),
      prisma.transaction.count({ where: { risk_flag: "SUSPICIOUS" } }),
    ]);

    const flagged = highRisk + suspicious;

    return {
      total_transactions: total,
      flagged_transactions: flagged,
      high_risk: highRisk,
      suspicious,
    };
  }
}