import { Router } from "express";
import transactionRoutes from "./transaction.routes";

const router = Router();

router.use("/", transactionRoutes);

export default router;