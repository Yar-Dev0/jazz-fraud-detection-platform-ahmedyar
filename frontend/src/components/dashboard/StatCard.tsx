import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { FaList, FaExclamationTriangle, FaFire, FaQuestionCircle } from "react-icons/fa";

type StatTone = "neutral" | "primary" | "warning" | "danger";

interface StatCardProps {
  label: string;
  value: number | ReactNode;
  tone?: StatTone;
}

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  const toneClasses =
    tone === "primary"
      ? "border-primary-blue bg-primary-blue/10"
      : tone === "warning"
      ? "border-neon-yellow bg-neon-yellow/10"
      : tone === "danger"
      ? "border-error-red bg-error-red/10"
      : "border-light-gray bg-white";

  const icon =
    tone === "primary" ? (
      <FaList className="text-primary-blue" />
    ) : tone === "warning" ? (
      <FaExclamationTriangle className="text-neon-yellow" />
    ) : tone === "danger" ? (
      <FaFire className="text-error-red" />
    ) : (
      <FaQuestionCircle className="text-text-gray" />
    );

  return (
    <Card className={`flex flex-col gap-3 border ${toneClasses}`}>
      <div className="flex items-center justify-between text-xs font-medium text-text-gray">
        <span className="flex items-center gap-1">
          {icon}
          {label}
        </span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-text-dark">
        {value}
      </div>
    </Card>
  );
}