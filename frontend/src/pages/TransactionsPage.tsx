import { useDashboard } from "../hooks/useDashboard";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { Spinner } from "../components/ui/Spinner";

export default function TransactionsPage() {
  const { transactions, loading, error } = useDashboard();

  return (
    <div className="space-y-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Explore individual transactions, filter by risk status, and page
            through recent activity.
          </p>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !transactions.length ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}