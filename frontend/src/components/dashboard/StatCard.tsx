import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { Activity, AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react";

type StatTone = "neutral" | "primary" | "warning" | "danger";

interface StatCardProps {
  label: string;
  value: number | ReactNode;
  tone?: StatTone;
}

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  const toneClasses =
    tone === "primary"
      ? "border-2 border-primary-blue bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 hover:bg-gradient-to-br hover:from-primary-blue/15 hover:to-primary-blue/10 hover:shadow-lg hover:shadow-primary-blue/20"
      : tone === "warning"
      ? "border-2 border-neon-yellow bg-gradient-to-br from-neon-yellow/10 to-neon-yellow/5 hover:bg-gradient-to-br hover:from-neon-yellow/15 hover:to-neon-yellow/10 hover:shadow-lg hover:shadow-neon-yellow/20"
      : tone === "danger"
      ? "border-2 border-error-red bg-gradient-to-br from-error-red/10 to-error-red/5 hover:bg-gradient-to-br hover:from-error-red/15 hover:to-error-red/10 hover:shadow-lg hover:shadow-error-red/20"
      : "border-2 border-light-gray bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 hover:shadow-lg hover:shadow-slate-200/50";

  const iconClass =
    tone === "primary"
      ? "text-primary-blue"
      : tone === "warning"
      ? "text-neon-yellow"
      : tone === "danger"
      ? "text-error-red"
      : "text-text-gray";

  const icon =
    tone === "primary" ? (
      <Activity className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    ) : tone === "warning" ? (
      <AlertTriangle className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    ) : tone === "danger" ? (
      <ShieldAlert className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    ) : (
      <TrendingUp className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    );

  return (
    <Card className={`flex justify-between items-center p-6 transition-all duration-300 ease-out hover:scale-105 cursor-default ${toneClasses}`}>
      <div className="flex flex-col gap-1">
        <div className="text-3xl font-bold tracking-tight text-text-dark">{value}</div>
        <div className="text-xs font-medium uppercase tracking-widest text-text-gray">{label}</div>
      </div>
      <div className="transition-all duration-300 ease-out hover:scale-110 flex-shrink-0">
        {icon}
      </div>
    </Card>
  );
}