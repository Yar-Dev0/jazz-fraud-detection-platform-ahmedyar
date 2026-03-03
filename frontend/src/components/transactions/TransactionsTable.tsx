import type { Transaction } from "../../types/api.types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface TransactionsTableProps {
  transactions: Transaction[];
  page: number;
  totalPages: number;
  totalCount: number;
  statusFilter: "all" | "high" | "suspicious" | "clean";
  onPageChange: (page: number) => void;
  onStatusChange: (status: "all" | "high" | "suspicious" | "clean") => void;
}

export function TransactionsTable({
  transactions,
  page,
  totalPages,
  totalCount,
  statusFilter,
  onPageChange,
  onStatusChange,
}: TransactionsTableProps) {
  const pageSize = 30;

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <Card className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-dark">
            Transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Live view of incoming transactions with fraud signals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium uppercase tracking-wide text-text-gray md:inline">
            Filter by status
          </span>
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as typeof statusFilter)
            }
            className="rounded-full border border-light-gray bg-white px-3 py-1.5 text-sm text-text-dark shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/40 focus:shadow-lg focus:shadow-primary-blue/20 cursor-pointer"
          >
            <option value="all">All Transactions</option>
            <option value="high">High Risk</option>
            <option value="suspicious">Suspicious</option>
            <option value="clean">Clean</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <HeaderCell>Transaction ID</HeaderCell>
              <HeaderCell>User ID</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Timestamp</HeaderCell>
              <HeaderCell>Device ID</HeaderCell>
              <HeaderCell>Risk Flag</HeaderCell>
              <HeaderCell>Rule Triggered</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {transactions.map((tx) => (
              <tr key={tx.id} className={rowClassName(tx.risk_flags)}>
                <Cell className="font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    {tx.transaction_id}
                    {tx.risk_flags.includes("HIGH_RISK") &&
                      tx.risk_flags.includes("SUSPICIOUS") && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                          <span>??</span>
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
            ))}
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-sm text-text-gray"
                >
                  No transactions yet. Upload a CSV file to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(page * pageSize, totalCount)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-700">
            {totalCount}
          </span>{' '}
          transactions
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm disabled:hover:border-slate-200 disabled:hover:bg-white"
          >
            Previous
          </button>
          <span className="text-slate-600">
            Page{' '}
            <span className="font-semibold text-slate-800">{page}</span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm disabled:hover:border-slate-200 disabled:hover:bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
    >
      {children}
    </th>
  );
}

function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
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