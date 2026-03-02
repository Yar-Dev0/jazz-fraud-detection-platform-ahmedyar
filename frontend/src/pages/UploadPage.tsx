import { UploadSection } from "../components/upload/UploadSection";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Upload Transactions
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingest CSV files, validate rows, and run fraud checks in real time.
        </p>
      </header>

      <UploadSection />
    </div>
  );
}