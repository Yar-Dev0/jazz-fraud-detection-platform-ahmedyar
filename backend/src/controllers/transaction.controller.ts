import type { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import { UploadService } from "../services/upload.service";
import { TransactionInput } from "../types/api.types";

export class TransactionController {
  public static async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input = req.body as TransactionInput;
      const created = await TransactionService.createTransaction(input);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  public static async listTransactions(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transactions = await TransactionService.listTransactions();
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  }

  public static async uploadTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const summaries = await UploadService.processMultipleFiles(files);
      res.status(200).json(summaries);
    } catch (error) {
      next(error);
    }
  }
}