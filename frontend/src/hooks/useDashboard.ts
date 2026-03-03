import { useQuery } from "@tanstack/react-query";
import { fetchDashboard, fetchTransactions } from "../api/api";
import type { DashboardStats, Transaction } from "../types/api.types";

interface UseDashboardState {
  stats: DashboardStats | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardState {
  const {
    data: stats,
    isLoading: loadingStats,
    isError: statsError,
    error: statsErrObj,
    refetch: refetchStats,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    retry: false,
  });

  const {
    data: transactionsData,
    isLoading: loadingTx,
    isError: txError,
    error: txErrObj,
    refetch: refetchTx,
  } = useQuery<{
    transactions: Transaction[];
    total: number;
  }>({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
    retry: false,
  });

  const transactions = transactionsData?.transactions;

  const loading = loadingStats || loadingTx;
  let error: string | null = null;
  if (statsError) {
    error =
      (statsErrObj as Error)?.message ||
      "Unable to load dashboard information.";
  } else if (txError) {
    error =
      (txErrObj as Error)?.message ||
      "Unable to load transactions.";
  }

  const refresh = async () => {
    await Promise.all([refetchStats(), refetchTx()]);
  };

  return {
    stats: stats ?? null,
    transactions: transactions ?? [],
    loading,
    error,
    refresh,
  };
}