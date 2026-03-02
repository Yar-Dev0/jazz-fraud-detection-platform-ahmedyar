import type { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
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
}