import { StatCard } from "./StatCard";
import type { DashboardStats } from "../../types/api.types";
import { Spinner } from "../ui/Spinner";

interface DashboardCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function DashboardCards({ stats, loading }: DashboardCardsProps) {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="col-span-1 flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-8">
          <Spinner />
        </div>
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