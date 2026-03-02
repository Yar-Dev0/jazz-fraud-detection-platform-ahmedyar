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
          "bg-light-gray text-text-gray": variant === "default",
          "bg-success-green/20 text-success-green ring-1 ring-success-green/40":
            variant === "success",
          "bg-neon-yellow/20 text-dark-navy ring-1 ring-neon-yellow/40":
            variant === "warning",
          "bg-error-red/20 text-error-red ring-1 ring-error-red/40": variant === "danger",
        }
      )}
    >
      {children}
    </span>
  );
}