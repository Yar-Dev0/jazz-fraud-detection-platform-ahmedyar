import { Prisma } from "@prisma/client";
import { RiskFlag, TransactionInput } from "../types/api.types";

export interface FraudEvaluationResult {
  risk_flag: RiskFlag;
  rule_triggered: string | null;
}

export class FraudService {
  public static async evaluateTransaction(
    tx: Prisma.TransactionClient,
    input: TransactionInput
  ): Promise<FraudEvaluationResult> {
    if (input.amount > 20000) {
      return {
        risk_flag: "HIGH_RISK",
        rule_triggered: "Rule1: amount > 20000",
      };
    }

    const userTxCount = await tx.transaction.count({
      where: { user_id: input.user_id },
    });

    if (userTxCount >= 3) {
      return {
        risk_flag: "SUSPICIOUS",
        rule_triggered: "Rule2: more than 3 transactions by same user",
      };
    }

    return {
      risk_flag: "NORMAL",
      rule_triggered: null,
    };
  }
}