import { z } from "zod";

export const transactionSchema = z.object({
  transaction_id: z.string().min(1),
  user_id: z.string().min(1),
  amount: z.number().positive(),
  timestamp: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Invalid timestamp, expected ISO string",
    }),
  device_id: z.string().min(1),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;