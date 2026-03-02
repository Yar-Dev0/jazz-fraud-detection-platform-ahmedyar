import type { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";

export class DashboardController {
  public static async getStats(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const stats = await TransactionService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}