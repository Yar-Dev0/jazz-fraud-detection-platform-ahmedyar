-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "device_id" TEXT NOT NULL,
    "risk_flag" TEXT,
    "risk_flags" TEXT NOT NULL DEFAULT 'NORMAL',
    "rule_triggered" TEXT
);
INSERT INTO "new_Transaction" ("amount", "device_id", "id", "risk_flag", "risk_flags", "rule_triggered", "timestamp", "transaction_id", "user_id") SELECT "amount", "device_id", "id", "risk_flag", coalesce("risk_flags", 'NORMAL') AS "risk_flags", "rule_triggered", "timestamp", "transaction_id", "user_id" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_transaction_id_key" ON "Transaction"("transaction_id");
CREATE INDEX "Transaction_user_id_idx" ON "Transaction"("user_id");
CREATE INDEX "Transaction_risk_flag_idx" ON "Transaction"("risk_flag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
