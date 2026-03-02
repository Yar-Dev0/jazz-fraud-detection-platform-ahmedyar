import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { uploadTransactions } from "../../api/api";
import type { UploadSummary as UploadSummaryType } from "../../types/api.types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { UploadSummary } from "./UploadSummary";
import { FaTimes } from "react-icons/fa";
import { Cloud, CheckCircle2 } from "lucide-react";

interface UploadSectionProps {
  onUploadComplete?: () => Promise<void> | void;
}

export function UploadSection({ onUploadComplete }: UploadSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<UploadSummaryType[]>([]);
  const [multi, setMulti] = useState(false);
  
  const toggleMulti = () => {
    setMulti((m) => {
      const newVal = !m;
      if (!newVal && files.length > 1) {
        // drop extras when disabling multi
        setFiles((prev) => prev.slice(0, 1));
      }
      // clear the hidden input value so the browser doesn't remember multiple files
      if (inputRef.current && !newVal) {
        inputRef.current.value = "";
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
    if (valid.length === 0) return;
    // Accumulate files if multi is enabled, otherwise replace
    setFiles((prev) => multi ? [...prev, ...valid] : valid.slice(0, 1));
    const count = multi ? valid.length : 1;
    toast.success(`Ready to upload ${count} file(s)`, {
      icon: "📂",
    });
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
    if (valid.length === 0) return;
    // Accumulate files if multi is enabled, otherwise replace
    setFiles((prev) => multi ? [...prev, ...valid] : valid.slice(0, 1));
    const count = multi ? valid.length : 1;
    toast.success(`Ready to upload ${count} file(s)`, {
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

  // Disable upload button if multi is OFF and there's exactly 1 file
  const isUploadDisabled = files.length === 0 || (!multi && files.length > 1);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Transactions Upload
            </h2>
            <p className="text-sm text-slate-500">
              Drag & drop CSV files or click the area to browse. Only ".csv" files allowed.
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Toggle Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMulti}
                disabled={loading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ease-out ${
                  multi
                    ? "bg-primary-blue shadow-lg shadow-primary-blue/30"
                    : "bg-slate-300 shadow-md shadow-slate-300/20"
                } ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    multi ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {multi ? "Multiple files" : "Single file"}
              </span>
            </div>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !loading && inputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-16 text-center text-sm text-slate-500 transition-all duration-300 ${
                loading
                  ? "pointer-events-none opacity-50 border-slate-300"
                  : "cursor-pointer border-slate-300 hover:border-primary-blue hover:from-blue-50 hover:to-blue-100 hover:shadow-lg hover:shadow-blue-100/50"
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
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-blue to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110">
                <Cloud className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <p className="mb-1 font-semibold text-slate-700">
                {files.length === 0
                  ? "Drop CSV files here or click to browse"
                  : `${files.length} file(s) selected`}
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 text-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:from-slate-100"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-primary-blue flex-shrink-0" />
                      <span className="truncate text-slate-700 font-medium">{file.name}</span>
                      <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="ml-2 text-slate-400 transition-colors duration-300 hover:text-error-red flex-shrink-0"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button
              onClick={handleUpload}
              loading={loading}
              disabled={isUploadDisabled}
              className={`transition-all duration-300 ${
                isUploadDisabled
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-primary-blue/40"
              }`}
            >
              {multi ? `Upload ${files.length} File(s)` : "Upload"}
            </Button>
          </div>
        </div>
      </Card>

      <UploadSummary summaries={summaries} />
    </div>
  );
}