import { PrismaClient, Prisma } from "@prisma/client";
import { FraudService } from "./fraud.service";
import {
  DashboardStats,
  TransactionInput,
  TransactionRecord,
  RiskFlag,
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

      // Determine primary risk flag (prioritize HIGH_RISK over SUSPICIOUS)
      const primaryRiskFlag = fraudResult.risk_flags.includes("HIGH_RISK")
        ? "HIGH_RISK"
        : fraudResult.risk_flags.includes("SUSPICIOUS")
        ? "SUSPICIOUS"
        : "NORMAL";

      const created = await tx.transaction.create({
        data: {
          ...input,
          timestamp: new Date(input.timestamp),
          risk_flag: primaryRiskFlag,
          risk_flags: fraudResult.risk_flags.join(","),
          rule_triggered: fraudResult.rule_triggered,
        },
      });

      return {
        ...created,
        risk_flags: (created.risk_flags || "NORMAL").split(",") as RiskFlag[],
      } as unknown as TransactionRecord;
    });
  }

  public static async listTransactions(): Promise<TransactionRecord[]> {
    const transactions = await prisma.transaction.findMany({
      orderBy: { timestamp: "desc" },
    });
    return transactions.map(tx => ({
      ...tx,
      risk_flags: (tx.risk_flags || "NORMAL").split(",") as RiskFlag[],
    })) as unknown as TransactionRecord[];
  }

  public static async getDashboardStats(): Promise<DashboardStats> {
    const total = await prisma.transaction.count();
    const transactions = await prisma.transaction.findMany({
      select: { risk_flags: true },
    });

    let highRisk = 0;
    let suspicious = 0;

    transactions.forEach(tx => {
      const flags = (tx.risk_flags || "NORMAL").split(",");
      if (flags.includes("HIGH_RISK")) highRisk++;
      if (flags.includes("SUSPICIOUS")) suspicious++;
    });

    // Flagged is unique transactions (not double-counted)
    const flagged = transactions.filter(tx => {
      const flags = (tx.risk_flags || "NORMAL").split(",");
      return flags.includes("HIGH_RISK") || flags.includes("SUSPICIOUS");
    }).length;

    return {
      total_transactions: total,
      flagged_transactions: flagged,
      high_risk: highRisk,
      suspicious,
    };
  }
}