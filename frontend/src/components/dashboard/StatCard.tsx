import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { Activity, Flag, ShieldAlert, Zap } from "lucide-react";

type StatTone = "neutral" | "primary" | "flagged" | "suspicious" | "danger";

interface StatCardProps {
  label: string;
  value: number | ReactNode;
  tone?: StatTone;
}

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  const toneClasses =
    tone === "primary"
      ? "border-2 border-primary-blue bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 hover:bg-gradient-to-br hover:from-primary-blue/15 hover:to-primary-blue/10 hover:shadow-lg hover:shadow-primary-blue/20"
      : tone === "flagged"
      ? "border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-50/50 hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-50 hover:shadow-lg hover:shadow-amber-200/50"
      : tone === "suspicious"
      ? "border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-orange-50/50 hover:bg-gradient-to-br hover:from-orange-100 hover:to-orange-50 hover:shadow-lg hover:shadow-orange-200/50"
      : tone === "danger"
      ? "border-2 border-error-red bg-gradient-to-br from-error-red/10 to-error-red/5 hover:bg-gradient-to-br hover:from-error-red/15 hover:to-error-red/10 hover:shadow-lg hover:shadow-error-red/20"
      : "border-2 border-light-gray bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 hover:shadow-lg hover:shadow-slate-200/50";

  const iconClass =
    tone === "primary"
      ? "text-primary-blue"
      : tone === "flagged"
      ? "text-amber-600"
      : tone === "suspicious"
      ? "text-orange-600"
      : tone === "danger"
      ? "text-error-red"
      : "text-text-gray";

  const icon =
    tone === "primary" ? (
      <Activity className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    ) : tone === "flagged" ? (
      <Flag className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    ) : tone === "suspicious" ? (
      <Zap className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    ) : tone === "danger" ? (
      <ShieldAlert className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
    ) : (
      <Activity className={`w-8 h-8 ${iconClass}`} strokeWidth={1.5} />
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