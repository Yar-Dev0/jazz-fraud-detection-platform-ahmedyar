import axios from "axios";
import type { DashboardStats, Transaction, UploadSummary } from "../types/api.types";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export async function fetchDashboard(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/dashboard");
  return data;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data;
}

export async function uploadTransactions(files: File[]): Promise<UploadSummary[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await api.post<UploadSummary[]>("/transactions/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}