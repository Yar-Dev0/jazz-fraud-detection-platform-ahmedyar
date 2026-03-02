import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export function Button({ children, loading, className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center justify-center rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 ease-out hover:bg-dark-navy hover:shadow-lg hover:shadow-primary-blue/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-sm disabled:hover:shadow-sm disabled:hover:-translate-y-0",
        className
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}