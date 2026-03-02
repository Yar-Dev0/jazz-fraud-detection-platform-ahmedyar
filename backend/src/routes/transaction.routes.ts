import { Router } from "express";
import multer from "multer";
import { TransactionController } from "../controllers/transaction.controller";
import { DashboardController } from "../controllers/dashboard.controller";
import { validateBody } from "../middleware/validate.middleware";
import { transactionSchema } from "../validations/transaction.schema";
import { UploadService } from "../services/upload.service";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post(
  "/transactions",
  validateBody(transactionSchema),
  TransactionController.createTransaction
);

router.get("/transactions", TransactionController.listTransactions);

router.get("/dashboard", DashboardController.getStats);

router.post(
  "/transactions/upload",
  upload.array("files"),
  async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const summaries = [];

      for (const file of files) {
        const summary = await UploadService.processCsvFile(file.path);
        summaries.push(summary);
      }

      res.status(200).json(summaries);
    } catch (error) {
      next(error);
    }
  }
);

export default router;