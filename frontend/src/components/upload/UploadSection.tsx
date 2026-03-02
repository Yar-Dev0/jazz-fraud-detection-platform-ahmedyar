import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { uploadTransactions } from "../../api/api";
import type { UploadSummary as UploadSummaryType } from "../../types/api.types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { UploadSummary } from "./UploadSummary";
import { FaTimes } from "react-icons/fa";

interface UploadSectionProps {
  onUploadComplete?: () => Promise<void> | void;
}

export function UploadSection({ onUploadComplete }: UploadSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<UploadSummaryType[]>([]);
  const [multi, setMulti] = useState(true);
  const toggleMulti = () => {
    setMulti((m) => {
      const newVal = !m;
      if (!newVal && files.length > 1) {
        // drop extras
        setFiles((prev) => prev.slice(0, 1));
      }
      return newVal;
    });
  };
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    const arr = Array.from(selectedFiles);
    const valid = arr.filter((file) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      return true;
    });
    setFiles(multi ? valid : valid.slice(0, 1));
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (loading) return;
    const droppedFiles = event.dataTransfer.files;
    if (!droppedFiles) return;
    const arr = Array.from(droppedFiles);
    const valid = arr.filter((file) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      return true;
    });
    if (valid.length === 0) {
      return;
    }
    setFiles((prev) => (multi ? [...prev, ...valid] : valid.slice(0, 1)));
    toast.success(`Ready to upload ${valid.length} file(s)`, {
      icon: "📂",
    });
  }, [loading, multi]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one CSV file");
      return;
    }

    setLoading(true);
    toast.loading("Uploading transactions...", { id: "upload" });
    const allSummaries: UploadSummaryType[] = [];

    try {
      for (const file of files) {
        try {
          const result = await uploadTransactions([file]);
          allSummaries.push(...result);
          const last = result[result.length - 1];
          toast.success(`Uploaded ${last.file_name}`, { id: "upload" });
          if (last.duplicates > 0) {
            toast.success(`Removed ${last.duplicates} duplicate row(s)`, {
              icon: "⚠️",
            });
          }
        } catch (error) {
          console.error(error);
          toast.error(`Upload failed for ${file.name}`, { id: "upload" });
        }
      }

      setSummaries(allSummaries);
      setFiles([]);
      if (onUploadComplete) {
        await onUploadComplete();
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { id: "upload" });
    } finally {
      toast.remove("upload");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Transactions Upload
            </h2>
            <p className="text-sm text-slate-500">
              Drag & drop CSV files or click the area to browse. Only
              ".csv" files allowed.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={multi}
                onChange={toggleMulti}
                id="multi-toggle"
              />
              <label htmlFor="multi-toggle" className="text-sm text-slate-700">
                Enable multiple files
              </label>
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !loading && inputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-16 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-100 ${
                loading ? "pointer-events-none opacity-50" : "cursor-pointer"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                multiple={multi}
                onChange={handleFileChange}
                disabled={loading}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-blue text-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"
                  />
                </svg>
              </div>
              <p className="mb-1 font-medium text-slate-700">
                {files.length === 0
                  ? "Drop CSV files here or click to browse"
                  : `${files.length} file(s) selected`}
              </p>
            </div>
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-slate-500 hover:text-slate-800"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Button onClick={handleUpload} loading={loading}>
              Upload
            </Button>
          </div>
        </div>
      </Card>

      <UploadSummary summaries={summaries} />
    </div>
  );
}