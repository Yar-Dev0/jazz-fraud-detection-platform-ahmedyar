import type { UploadSummary as UploadSummaryType } from "../../types/api.types";
import { Card } from "../ui/Card";

interface UploadSummaryProps {
  summaries: UploadSummaryType[];
}

export function UploadSummary({ summaries }: UploadSummaryProps) {
  if (summaries.length === 0) return null;

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-text-dark">
        Upload Summary
      </h2>
      <div className="space-y-4">
        {summaries.map((summary) => (
          <div
            key={summary.file_name}
            className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 text-sm transition-all duration-300 ease-out hover:shadow-md hover:border-slate-300 hover:from-slate-100"
          >
            <div className="mb-3 font-semibold text-slate-800">
              {summary.file_name}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
      <span className="text-xs text-text-gray">{label}</span>
      <span className="text-sm font-medium text-text-dark">{value}</span>
    </div>
  );
}