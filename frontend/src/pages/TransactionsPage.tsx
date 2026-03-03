import { useDashboard } from "../hooks/useDashboard";
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

const TransactionsTable = lazy(() =>
  import("../components/transactions/TransactionsTable").then((mod) => ({
    default: mod.TransactionsTable,
  }))
);

export default function TransactionsPage() {
  const { transactions, error } = useDashboard();
  const navigate = useNavigate();

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
        <div className="rounded-lg border border-error-red bg-error-red/10 px-4 py-3 text-sm text-error-red">
          <p>Please upload transactions first to get started.</p>
          <button
            onClick={() => navigate("/upload")}
            className="mt-2 inline-block rounded-full bg-primary-blue px-3 py-1 text-white text-xs font-medium hover:bg-dark-navy"
          >
            Upload Transactions
          </button>
        </div>
      )}

      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-6 animate-pulse rounded bg-slate-200"
              />
            ))}
          </div>
        }
      >
        <TransactionsTable transactions={transactions} />
      </Suspense>
    </div>
  );
}