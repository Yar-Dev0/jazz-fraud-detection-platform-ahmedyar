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
      ? "border-primary-blue bg-primary-blue/20"
      : tone === "warning"
      ? "border-neon-yellow bg-neon-yellow/20"
      : tone === "danger"
      ? "border-error-red bg-error-red/20"
      : "border-light-gray bg-light-gray";

  const icon =
    tone === "primary" ? (
      <FaList className="text-primary-blue" />
    ) : tone === "warning" ? (
      <FaExclamationTriangle className="text-dark-navy" />
    ) : tone === "danger" ? (
      <FaFire className="text-error-red" />
    ) : (
      <FaQuestionCircle className="text-text-gray" />
    );

  return (
    <Card className={`flex justify-between items-center p-6 border ${toneClasses}`}>
      <div>
        <div className="text-2xl font-bold text-text-dark">{value}</div>
        <div className="text-sm text-text-gray mt-1">{label}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </Card>
  );
}