export type RiskFlag = "HIGH_RISK" | "SUSPICIOUS" | "NORMAL" | null;

export interface Transaction {
  id: number;
  transaction_id: string;
  user_id: string;
  amount: number;
  timestamp: string;
  device_id: string;
  risk_flag: RiskFlag;
  rule_triggered: string | null;
}

export interface DashboardStats {
  total_transactions: number;
  flagged_transactions: number;
  high_risk: number;
  suspicious: number;
}

export interface UploadSummary {
  file_name: string;
  total_rows: number;
  total_columns: number;
  inserted: number;
  duplicates: number;
  invalid_rows: number;
  high_risk: number;
  suspicious: number;
}