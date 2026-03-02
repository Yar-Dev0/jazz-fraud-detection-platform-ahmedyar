import type { UploadSummary as UploadSummaryType } from "../../types/api.types";
import { Card } from "../ui/Card";

interface UploadSummaryProps {
  summaries: UploadSummaryType[];
}

export function UploadSummary({ summaries }: UploadSummaryProps) {
  if (summaries.length === 0) return null;

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Upload Summary
      </h2>
      <div className="space-y-4">
        {summaries.map((summary) => (
          <div
            key={summary.file_name}
            className="rounded-lg border border-slate-200 p-3 text-sm"
          >
            <div className="mb-2 font-medium text-slate-800">
              {summary.file_name}
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <SummaryItem label="Total Rows" value={summary.total_rows} />
              <SummaryItem label="Total Columns" value={summary.total_columns} />
              <SummaryItem label="Inserted" value={summary.inserted} />
              <SummaryItem label="Duplicates" value={summary.duplicates} />
              <SummaryItem label="Invalid Rows" value={summary.invalid_rows} />
              <SummaryItem label="High Risk" value={summary.high_risk} />
              <SummaryItem label="Suspicious" value={summary.suspicious} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}