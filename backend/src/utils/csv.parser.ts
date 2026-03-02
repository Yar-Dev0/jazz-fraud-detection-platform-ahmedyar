import { createReadStream } from "fs";
import { basename } from "path";
import { parse } from "csv-parse";

export interface ParsedCsvRow {
  [key: string]: string;
}

export interface ParsedCsvResult {
  fileName: string;
  rows: ParsedCsvRow[];
  totalRows: number;
  totalColumns: number;
}

export function parseCsvFile(
  filePath: string
): Promise<ParsedCsvResult> {
  return new Promise((resolve, reject) => {
    const rows: ParsedCsvRow[] = [];
    let columnsCount = 0;

    const parser = parse({
      columns: true,
      trim: true,
      skip_empty_lines: true,
    });

    createReadStream(filePath)
      .on("error", (err) => reject(err))
      .pipe(parser)
      .on("data", (row: ParsedCsvRow) => {
        rows.push(row);
        if (columnsCount === 0) {
          columnsCount = Object.keys(row).length;
        }
      })
      .on("end", () => {
        resolve({
          fileName: basename(filePath),
          rows,
          totalRows: rows.length,
          totalColumns: columnsCount,
        });
      })
      .on("error", (err: Error) => reject(err));
  });
}