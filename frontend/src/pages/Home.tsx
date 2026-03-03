import { useDashboard } from "../hooks/useDashboard";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";

const DashboardCards = lazy(() =>
  import("../components/dashboard/DashboardCards").then((mod) => ({
    default: mod.DashboardCards,
  }))
);

export default function Home() {
  const { stats, loading, error } = useDashboard();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-blue to-dark-navy text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-40 w-40 bg-neon-yellow opacity-5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 bg-blue-400 opacity-5 rounded-full blur-2xl" />
        </div>

        <div className="relative px-6 py-12 md:px-12 md:py-14">
          <div className="max-w-3xl">
            <div className="space-y-4">
              <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-neon-yellow ring-1 ring-white/30 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5 mr-2">
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-neon-yellow opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-yellow" />
                </span>
                Fraud Detection System
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Monitor Transactions
                <span className="block text-neon-yellow">Identify Fraud Instantly</span>
              </h1>
              <p className="text-base text-white/80 max-w-2xl leading-relaxed">
                TransactionGuard monitors your transactions in real-time, applies configurable fraud rules, and flags suspicious activity instantly. Stay in control of your transaction risk.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-8">
              <Link
                to="/transactions"
                className="inline-flex items-center justify-center rounded-lg bg-neon-yellow text-dark-navy font-semibold px-5 py-2.5 hover:bg-yellow-300 transition-all shadow-md hover:shadow-lg text-sm"
              >
                View Transactions
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center rounded-lg bg-white/20 text-white font-semibold px-5 py-2.5 hover:bg-white/30 transition-all border border-white/30 backdrop-blur-sm text-sm"
              >
                Upload Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-6 py-6 text-amber-900 dark:text-amber-100 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Get Started with RiskShield</h3>
              <p className="text-amber-900/80 dark:text-amber-100/80 text-sm">
                You haven't uploaded any transactions yet. Start monitoring fraud risk by uploading your transaction data now.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center rounded-lg bg-primary-blue text-white font-semibold px-4 py-2 hover:bg-dark-navy transition-all whitespace-nowrap"
            >
              Upload Transactions
            </Link>
          </div>
        </div>
      )}

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">Dashboard Analytics</h2>
          <p className="text-text-gray">Real-time metrics and insights about your transaction monitoring</p>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl bg-gradient-to-br from-slate-200 to-slate-100"
                />
              ))}
            </div>
          }
        >
          <DashboardCards stats={stats} loading={loading} />
        </Suspense>
      </section>
    </div>
  );
}