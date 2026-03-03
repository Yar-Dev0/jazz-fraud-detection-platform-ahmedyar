import React from "react";
import type { Transaction } from "../../types/api.types";
import { Badge } from "../ui/Badge";
import { formatAmount } from "../../utils/format";

interface TransactionRowProps {
  tx: Transaction;
}

export function TransactionRow({ tx }: TransactionRowProps) {
  return (
    <tr key={tx.id} className={rowClassName(tx.risk_flags)}>
      <Cell className="font-medium text-slate-900">
        <div className="flex items-center gap-2">
          {tx.transaction_id}
          {tx.risk_flags.includes("HIGH_RISK") &&
            tx.risk_flags.includes("SUSPICIOUS") && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                <span>⚠️</span>
                <span>CRITICAL</span>
              </div>
            )}
        </div>
      </Cell>
      <Cell>{tx.user_id}</Cell>
      <Cell className="font-semibold text-slate-900">
        {formatAmount(tx.amount)}
      </Cell>
      <Cell>{new Date(tx.timestamp).toLocaleString()}</Cell>
      <Cell>{tx.device_id}</Cell>
      <Cell>
        <div className="space-y-1">
          {tx.risk_flags.map((flag, idx) => (
            <div key={idx}>{renderRiskBadge(flag)}</div>
          ))}
        </div>
      </Cell>
      <Cell className="max-w-xs text-slate-500">
        {tx.rule_triggered ? (
          <div className="space-y-1">
            {tx.rule_triggered.split(", ").map((rule, idx) => (
              <div
                key={idx}
                className="text-xs bg-amber-50 border border-amber-200 rounded px-2 py-1 font-medium text-amber-800"
              >
                {rule}
              </div>
            ))}
          </div>
        ) : (
          "✔"
        )}
      </Cell>
    </tr>
  );
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-3 text-sm text-slate-800 ${className ?? ""}`}
    >
      {children}
    </td>
  );
}

function rowClassName(riskFlags: Transaction["risk_flags"]): string {
  if (riskFlags.includes("HIGH_RISK") && riskFlags.includes("SUSPICIOUS")) {
    return "bg-gradient-to-r from-purple-100/80 to-indigo-100/80 hover:from-purple-200/90 hover:to-indigo-200/90 border-l-4 border-l-purple-600 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-purple-200/70 cursor-pointer font-semibold ring-1 ring-purple-300/50";
  }
  if (riskFlags.includes("HIGH_RISK")) {
    return "bg-red-50/70 hover:bg-red-100/90 border-l-4 border-l-rose-400 transition-all duration-300 ease-out hover:shadow-md hover:shadow-rose-100/50 cursor-pointer";
  }
  if (riskFlags.includes("SUSPICIOUS")) {
    return "bg-amber-50/80 hover:bg-amber-100/90 border-l-4 border-l-amber-400 transition-all duration-300 ease-out hover:shadow-md hover:shadow-amber-100/50 cursor-pointer";
  }
  return "hover:bg-slate-50 border-l-4 border-l-transparent transition-all duration-300 ease-out hover:shadow-sm hover:shadow-slate-100/50 cursor-pointer";
}

function renderRiskBadge(flag: Transaction["risk_flags"][0]) {
  if (flag === "HIGH_RISK") {
    return <Badge variant="danger">High Risk</Badge>;
  }
  if (flag === "SUSPICIOUS") {
    return <Badge variant="warning">Suspicious</Badge>;
  }
  return <Badge variant="success">Clean</Badge>;
}