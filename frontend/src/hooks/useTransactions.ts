import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api/api";
import type { Transaction, TransactionListResponse } from "../types/api.types";

type StatusFilter = "all" | "high" | "suspicious" | "clean";

interface UseTransactionsOptions {
  page: number;
  pageSize: number;
  status: StatusFilter;
}

interface UseTransactionsResult {
  transactions: Transaction[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTransactions(
  opts: UseTransactionsOptions
): UseTransactionsResult {
  const {
    data,
    isLoading,
    isError,
    error: errObj,
    refetch,
  } = useQuery<TransactionListResponse>({
    queryKey: ["transactions", opts.page, opts.pageSize, opts.status],
    queryFn: () => fetchTransactions(opts.page, opts.pageSize, opts.status),
    retry: false,
  });

  let error: string | null = null;
  if (isError) {
    error = (errObj as Error)?.message || "Unable to load transactions.";
  }

  return {
    transactions: data?.transactions ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}