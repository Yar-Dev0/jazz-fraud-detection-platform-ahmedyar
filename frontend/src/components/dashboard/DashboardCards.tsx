import { StatCard } from "./StatCard";
import type { DashboardStats } from "../../types/api.types";

interface DashboardCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function DashboardCards({ stats, loading }: DashboardCardsProps) {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard
        label="Total Transactions"
        value={stats?.total_transactions ?? 0}
        tone="primary"
      />
      <StatCard
        label="Total Flagged"
        value={stats?.flagged_transactions ?? 0}
        tone="warning"
      />
      <StatCard label="High Risk" value={stats?.high_risk ?? 0} tone="danger" />
      <StatCard
        label="Suspicious"
        value={stats?.suspicious ?? 0}
        tone="warning"
      />
    </div>
  );
}