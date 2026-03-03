
interface PaginationFooterProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function PaginationFooter({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationFooterProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
      <div className="text-center sm:text-left">
        Showing{' '}
        <span className="font-semibold text-slate-700">
          {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
        </span>{' '}
        to{' '}
        <span className="font-semibold text-slate-700">
          {Math.min(page * pageSize, totalCount)}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-slate-700">
          {totalCount}
        </span>{' '}
        transactions
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm disabled:hover:border-slate-200 disabled:hover:bg-white w-full sm:w-auto"
        >
          Previous
        </button>
        <span className="text-slate-600 text-center whitespace-nowrap flex-grow">
          Page{' '}
          <span className="font-semibold text-slate-800">{page}</span>{' '}
          of{' '}
          <span className="font-semibold text-slate-800">{totalPages}</span>
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm disabled:hover:border-slate-200 disabled:hover:bg-white w-full sm:w-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
}