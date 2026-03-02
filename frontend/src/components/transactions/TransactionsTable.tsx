import { useMemo, useState } from "react";
import type { Transaction } from "../../types/api.types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "high" | "suspicious" | "clean">(
    "all"
  );
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "high") return tx.risk_flag === "HIGH_RISK";
      if (statusFilter === "suspicious") return tx.risk_flag === "SUSPICIOUS";
      return !tx.risk_flag || tx.risk_flag === "NORMAL";
    });
  }, [transactions, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const handleChangeFilter = (value: typeof statusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <Card className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-dark">
            Transactions
          </h2>
          <p className="mt-1 text-xs text-slate-500">
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
              handleChangeFilter(e.target.value as typeof statusFilter)
            }
            className="rounded-full border border-light-gray bg-white px-3 py-1.5 text-sm text-text-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/40"
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
            {paged.map((tx) => (
              <tr
                key={tx.id}
                className={rowClassName(tx.risk_flag)}
              >
                <Cell className="font-medium text-slate-900">
                  {tx.transaction_id}
                </Cell>
                <Cell>{tx.user_id}</Cell>
                <Cell className="font-semibold text-slate-900">
                  {formatAmount(tx.amount)}
                </Cell>
                <Cell>
                  {new Date(tx.timestamp).toLocaleString()}
                </Cell>
                <Cell>{tx.device_id}</Cell>
                <Cell>
                  {renderRiskBadge(tx.risk_flag ?? "NORMAL")}
                </Cell>
                <Cell className="max-w-xs truncate text-slate-500">
                  {tx.rule_triggered ?? "—"}
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
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * pageSize, filtered.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          transactions
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-slate-600">
            Page{" "}
            <span className="font-semibold text-slate-800">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {totalPages}
            </span>
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
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

function rowClassName(riskFlag: Transaction["risk_flag"]): string {
  if (riskFlag === "HIGH_RISK") {
    return "bg-red-50/70 hover:bg-red-100/90 border-l-4 border-l-rose-400";
  }
  if (riskFlag === "SUSPICIOUS") {
    return "bg-amber-50/80 hover:bg-amber-100/90 border-l-4 border-l-amber-400";
  }
  return "hover:bg-slate-50 border-l-4 border-l-transparent";
}

function renderRiskBadge(flag: NonNullable<Transaction["risk_flag"]>) {
  if (flag === "HIGH_RISK") {
    return <Badge variant="danger">High Risk</Badge>;
  }
  if (flag === "SUSPICIOUS") {
    return <Badge variant="warning">Suspicious</Badge>;
  }
  return <Badge variant="success">Clean</Badge>;
}