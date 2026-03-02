import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 ease-out dark:bg-slate-900 dark:ring-slate-700/50",
        className
      )}
    >
      {children}
    </div>
  );
}