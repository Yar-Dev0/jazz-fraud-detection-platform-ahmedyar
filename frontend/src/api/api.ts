import type { DashboardStats, Transaction, UploadSummary } from "../types/api.types";
import axiosInstance from "./axios";

export async function fetchDashboard(): Promise<DashboardStats> {
  const { data } = await axiosInstance.get<DashboardStats>("/dashboard");
  return data;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await axiosInstance.get<Transaction[]>("/transactions");
  return data;
}

export async function uploadTransactions(files: File[]): Promise<UploadSummary[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await axiosInstance.post<UploadSummary[]>(
    "/transactions/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
}