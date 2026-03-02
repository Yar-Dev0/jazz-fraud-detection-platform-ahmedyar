import { useEffect, useState } from "react";
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardStats, txs] = await Promise.all([
        fetchDashboard(),
        fetchTransactions(),
      ]);
      setStats(dashboardStats);
      setTransactions(txs);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return {
    stats,
    transactions,
    loading,
    error,
    refresh: load,
  };
}