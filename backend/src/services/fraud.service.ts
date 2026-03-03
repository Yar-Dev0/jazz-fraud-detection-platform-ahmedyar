import { Prisma } from "@prisma/client";
import { RiskFlag, TransactionInput } from "../types/api.types";

export interface FraudEvaluationResult {
  risk_flags: RiskFlag[];
  rule_triggered: string | null;
}

export class FraudService {
  public static async evaluateTransaction(
    tx: Prisma.TransactionClient,
    input: TransactionInput
  ): Promise<FraudEvaluationResult> {
    const triggeredRules: string[] = [];
    const riskFlags: Set<RiskFlag> = new Set();

    if (input.amount > 20000) {
      triggeredRules.push("Rule1: amount > 20000");
      riskFlags.add("HIGH_RISK");
    }

    const userTxCount = await tx.transaction.count({
      where: { user_id: input.user_id },
    });

    if (userTxCount >= 3) {
      triggeredRules.push("Rule2: more than 3 transactions by same user");
      riskFlags.add("SUSPICIOUS");
    }

    return {
      risk_flags: Array.from(riskFlags).length > 0 ? Array.from(riskFlags) : ["NORMAL"],
      rule_triggered: triggeredRules.length > 0 ? triggeredRules.join(", ") : null,
    };
  }
}