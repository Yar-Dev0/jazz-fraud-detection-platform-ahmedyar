-- Add index on timestamp column for faster ordering
CREATE INDEX "Transaction_timestamp_idx" ON "Transaction"("timestamp");
