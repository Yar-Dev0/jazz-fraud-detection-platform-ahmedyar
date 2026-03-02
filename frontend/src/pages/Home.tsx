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
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-primary-blue text-white rounded-xl px-6 py-8">
        <div>
          <p className="mb-2 inline-flex items-center rounded-full bg-white/30 px-3 py-1 text-xs font-medium text-neon-yellow ring-1 ring-white/40">
            Real-time fraud detection and monitoring
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Transaction Risk Monitor
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/90">
            Stay ahead of suspicious activity with live transaction insights,
            configurable rules, and a streamlined workflow for your fraud ops
            team.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-xl bg-white px-4 py-4 text-sm shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:w-80">
          <div className="flex w-full items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-text-gray">
              Today&apos;s Overview
            </span>
            <span className="text-[11px] text-text-gray">Updated a moment ago</span>
          </div>
          <div className="flex w-full items-baseline justify-between">
            <div>
              <div className="text-2xl font-semibold text-text-dark dark:text-text-dark">
                {stats?.total_transactions ?? 0}
              </div>
              <div className="text-xs text-text-gray">Total transactions</div>
            </div>
            <div className="rounded-full bg-neon-yellow/20 px-3 py-1 text-[11px] font-medium text-dark-navy ring-1 ring-neon-yellow/40">
              {stats?.high_risk ?? 0} High Risk
            </div>
          </div>
          <p className="text-xs text-text-gray dark:text-text-gray">
            Monitor anomalies in real time and drill into flagged payments as
            they happen.
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-4 flex flex-col items-center gap-2 rounded-lg border border-error-red bg-error-red/10 px-4 py-3 text-sm text-error-red">
          <span>No dashboard data available.</span>
          <Link
            to="/upload"
            className="inline-block rounded-full bg-primary-blue px-3 py-1 text-white text-xs font-medium hover:bg-dark-navy"
          >
            Add transactions
          </Link>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Key Metrics
        </h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-slate-200"
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