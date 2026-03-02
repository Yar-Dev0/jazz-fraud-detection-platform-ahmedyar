import { useDashboard } from "../hooks/useDashboard";
import { DashboardCards } from "../components/dashboard/DashboardCards";

export default function Home() {
  const { stats, loading, error } = useDashboard();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">
            Real-time fraud detection and monitoring
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
            Transaction Risk Monitor
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Stay ahead of suspicious activity with live transaction insights,
            configurable rules, and a streamlined workflow for your fraud ops
            team.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-xl bg-white px-4 py-4 text-sm shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:w-80">
          <div className="flex w-full items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Today&apos;s Overview
            </span>
            <span className="text-[11px] text-slate-400">Updated a moment ago</span>
          </div>
          <div className="flex w-full items-baseline justify-between">
            <div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {stats?.total_transactions ?? 0}
              </div>
              <div className="text-xs text-slate-500">Total transactions</div>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
              {stats?.high_risk ?? 0} High Risk
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor anomalies in real time and drill into flagged payments as
            they happen.
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Key Metrics
        </h2>
        <DashboardCards stats={stats} loading={loading} />
      </section>
    </div>
  );
}