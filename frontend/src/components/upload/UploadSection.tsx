import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { uploadTransactions } from "../../api/api";
import type { UploadSummary as UploadSummaryType } from "../../types/api.types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { UploadSummary } from "./UploadSummary";

interface UploadSectionProps {
  onUploadComplete?: () => Promise<void> | void;
}

export function UploadSection({ onUploadComplete }: UploadSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<UploadSummaryType[]>([]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    const valid = Array.from(selectedFiles).filter((file) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      return true;
    });
    setFiles(valid);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = event.dataTransfer.files;
    if (!droppedFiles) return;
    const valid = Array.from(droppedFiles).filter((file) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      return true;
    });
    if (valid.length === 0) {
      return;
    }
    setFiles(valid);
    toast.success(`Ready to upload ${valid.length} file(s)`, {
      icon: "📂",
    });
  }, []);

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
          if (last.duplicates > 0) {
            toast.success("Removing duplicates from this upload…", {
              id: "upload",
              icon: "🧹",
            });
            toast.success(`Removed ${last.duplicates} duplicate row(s)`, {
              icon: "⚠️",
            });
            toast.loading("Almost there… finalizing upload", {
              id: "upload-final",
            });
            toast.success(
              `Uploaded ${last.file_name} with duplicates removed`,
              {
                id: "upload-final",
                icon: "✅",
              }
            );
          } else {
            toast.loading("Almost there… validating rows", {
              id: "upload-final",
            });
            toast.success(`Uploaded ${last.file_name}`, {
              id: "upload-final",
              icon: "✅",
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
              Drag and drop one or more CSV files, or browse from your
              computer. Invalid file types will be rejected.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-start">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-100"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                ⬆️
              </div>
              <p className="mb-1 font-medium text-slate-700">
                Drop CSV files here
              </p>
              <p className="text-xs text-slate-500">
                or click below to browse from your computer
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
              />
              {files.length > 0 && (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Ready to upload{" "}
                  <span className="font-semibold text-slate-800">
                    {files.length}
                  </span>{" "}
                  file(s)
                </div>
              )}
              <Button onClick={handleUpload} loading={loading}>
                Upload
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <UploadSummary summaries={summaries} />
    </div>
  );
}