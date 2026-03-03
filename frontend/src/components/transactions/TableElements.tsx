import React from "react";

export function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
    >
      {children}
    </th>
  );
}

export function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-3 text-sm text-slate-800 ${
        className ?? ""
      }`}
    >
      {children}
    </td>
  );
}