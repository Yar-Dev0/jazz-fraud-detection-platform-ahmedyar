import type { ReactNode } from "react";
import { Card } from "../ui/Card";

type StatTone = "neutral" | "primary" | "warning" | "danger";

interface StatCardProps {
  label: string;
  value: number | ReactNode;
  tone?: StatTone;
}

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  const toneClasses =
    tone === "primary"
      ? "border-sky-100 bg-gradient-to-br from-sky-50 to-sky-100"
      : tone === "warning"
      ? "border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100"
      : tone === "danger"
      ? "border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100"
      : "border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100";

  const dotColor =
    tone === "primary"
      ? "bg-sky-500"
      : tone === "warning"
      ? "bg-amber-500"
      : tone === "danger"
      ? "bg-rose-500"
      : "bg-slate-400";

  return (
    <Card className={`flex flex-col gap-3 border ${toneClasses}`}>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{label}</span>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      </div>
      <div className="text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </Card>
  );
}