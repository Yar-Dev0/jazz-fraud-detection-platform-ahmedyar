import { Router } from "express";
import multer from "multer";
import { TransactionController } from "../controllers/transaction.controller";
import { DashboardController } from "../controllers/dashboard.controller";
import { validateBody } from "../middleware/validate.middleware";
import { transactionSchema } from "../validations/transaction.schema";

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
  TransactionController.uploadTransactions
);

export default router;