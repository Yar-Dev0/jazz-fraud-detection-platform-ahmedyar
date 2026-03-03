import type { Transaction } from "../../types/api.types";
import { Card } from "../ui/Card";
import { TableHeader } from "./TableHeader";
import { HeaderCell } from "./TableElements";
import { TransactionRow } from "./TransactionRow";
import { PaginationFooter } from "./PaginationFooter";

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

  return (
    <Card className="space-y-4">
      <TableHeader statusFilter={statusFilter} onStatusChange={onStatusChange} />

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
              <TransactionRow key={tx.id} tx={tx} />
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

      <PaginationFooter
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </Card>
  );
}