import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeVariant = "default" | "success" | "warning" | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-slate-100 text-slate-700": variant === "default",
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100":
            variant === "success",
          "bg-amber-50 text-amber-700 ring-1 ring-amber-100":
            variant === "warning",
          "bg-rose-50 text-rose-700 ring-1 ring-rose-100": variant === "danger",
        }
      )}
    >
      {children}
    </span>
  );
}