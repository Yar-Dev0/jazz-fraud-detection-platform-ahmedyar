interface TableHeaderProps {
  statusFilter: "all" | "high" | "suspicious" | "clean";
  onStatusChange: (status: "all" | "high" | "suspicious" | "clean") => void;
}

export function TableHeader({ statusFilter, onStatusChange }: TableHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-text-dark">
          Recent transactions
        </h2>
        <p className="mt-1 text-sm text-slate-500 max-w-xl">
          Paginated transactions list. Filter flagged activity, review entries, or browse past records.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs font-medium uppercase tracking-wide text-text-gray md:inline">
          Filter by status
        </span>
        <select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value as "all" | "high" | "suspicious" | "clean")}
          aria-label="Filter transactions by status"
          className="rounded-full border border-primary-blue/30 bg-white px-3 py-1.5 text-sm text-text-dark shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/40 focus:shadow-lg focus:shadow-primary-blue/20 cursor-pointer ring-1 ring-primary-blue/10"
        >
          <option value="all">All Transactions</option>
          <option value="high">High Risk</option>
          <option value="suspicious">Suspicious</option>
          <option value="clean">Clean</option>
        </select>
      </div>
    </div>
  );
}