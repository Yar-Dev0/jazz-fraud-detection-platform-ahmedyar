# Mini Transaction Risk Monitoring System

## Overview
This repository implements a lightweight transaction risk monitoring platform with a React frontend and a Node.js + TypeScript backend. The system ingests transaction CSV uploads, applies deterministic fraud rules, and surfaces flagged transactions and dashboard statistics.

## Contents
This repository is my implementation of a compact transaction risk monitoring system. I built a TypeScript backend (Express + Prisma) and a React frontend to let you upload CSV transaction files, evaluate deterministic fraud rules, and explore flagged transactions and dashboard metrics.
- `frontend/` — React + TypeScript SPA for uploading data and viewing transactions and dashboard metrics.

## Quick Setup

Prerequisites: Node 18+, npm (or pnpm/yarn), Git.

1) Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

3) Upload sample transactions via the UI at the frontend URL (usually `http://localhost:5173`) or POST CSV to the backend `/upload` route.

## Architecture Overview

- API: An Express app in `backend/src` exposes REST endpoints. Routes live in `backend/src/routes` and controllers in `backend/src/controllers`.
- Services: Domain logic is in `backend/src/services` (particularly `fraud.service.ts`, `transaction.service.ts`, and `upload.service.ts`).
- Data: Prisma is used for data modeling (`backend/prisma/schema.prisma`) and migrations (`backend/prisma/migrations`). The local development DB is SQLite; production should use Postgres.
- Frontend: A Vite + React app in `frontend/`. UI pieces live under `frontend/src/components`, data-fetching hooks in `frontend/src/hooks`, and API helpers in `frontend/src/api`.

I kept responsibilities simple and testable:
- Controllers adapt HTTP-level concerns and pass validated data to services.
- Services implement the rules, persistence patterns, and upload processing.
- Utilities handle CSV parsing and normalization before any rule evaluation.

## How Fraud Rule Logic Is Structured

I implemented rules as pure, deterministic checks in `backend/src/services/fraud.service.ts`. Each evaluation returns two things:

Key design points:
- Each rule is a function that accepts a `Transaction` object and returns either `null` (no flag) or a `RuleResult` describing the flag level, code, and reason.
- Rules are evaluated in a defined priority order. The service can be configured to either stop on the first matched rule (priority mode) or collect all matching rules (multi-flag mode).
- Rule metadata (id, priority, severity, description) is colocated with the rule implementation to make behavior explicit and easily testable.
- Transaction enrichment (e.g., per-user recent transaction counts) is performed before the rule evaluation step so rules remain pure and simple.

Example rule types (implemented in code):
- High amount rule: flag when `amount >= HIGH_AMOUNT_THRESHOLD`.
- Velocity rule: flag when a user submits more than `N` transactions within `T` minutes.

Why this structure:
- Deterministic and testable: easy to write unit tests for each rule function.
- Extensible: new rules are pure functions that plug into the evaluation pipeline.
- Configurable: thresholds and runtime behavior are environment-driven (env vars or feature flags).

## Assumptions

- Transactions are provided with ISO timestamps and a unique `transactionId`.
- No persistent authentication is required for the assignment; production would require auth and RBAC.
- Rules operate on the fields available in uploaded CSVs; enrichment (user history) uses recent DB reads.
- The current implementation favors correctness and clarity for evaluation rather than micro-optimizations.

## Scaling to 1M Transactions/Day — Practical Roadmap

Short-term (immediate improvements):
- Move from SQLite to PostgreSQL for concurrent writes, better indexing, and partitioning support.
- Add background ingestion queue for CSV processing (e.g., BullMQ, RabbitMQ, or AWS SQS) so HTTP requests return quickly and heavy processing runs async.
- Add batching when writing transactions to DB to reduce overhead.

Medium-term (throughput & storage):
- Use time-based partitioning (Postgres table partitioning) per day/week to keep query performance stable.
- Create indexes for frequently queried columns: `createdAt`, `userId`, and any columns used by rules.
- Introduce read-replicas for analytic / dashboard queries to avoid affecting ingestion.
- Cache hot datasets (recent user activity) in Redis to enable fast velocity rule evaluation without many DB reads.

Long-term (1M+/day):
- Stream processing: push transactions into a Kafka topic and consume with stream processors to evaluate real-time rules at scale.
- Move heavy/slow rules to stream processors and emit alerts into downstream systems (Elasticsearch, time-series DB, or alerting pipeline).
- Autoscale processing workers and API nodes behind a load balancer.
- Observability: add metrics (Prometheus), traces, and logging to track ingestion latency and rule evaluation times.

Estimated sizing notes:
- 1M/day ≈ 11.6 transactions/sec sustained; consider peak factors (burst multipliers) and plan for 10x peak headroom.
- With batching and a performant DB, a small cluster of worker nodes + a managed DB can handle this—move to stream processors when latency and complexity grow.

## Important Instructions & Evaluation Guidelines (Please Read)

> AI usage disclosure:
>
> - Core backend architecture, database schema, and fraud rule logic were designed and implemented by ME ( the candidate).
> - AI assistance was used for frontend design polish, TypeScript typing hints, copywriting edits, and README/documentation clarity.
> - Specific AI usage: small prompts were used to refine component layout and fix TypeScript type errors in the frontend. No AI-generated business logic or database design was used.

## How to Evaluate This Project Locally

- Start the backend and run migrations as shown in Quick Setup.
- Start the frontend.
- Upload a CSV via the UI or use the `/upload` API. Sample CSVs (column names) match the Prisma schema in `prisma/schema.prisma`.
- Review flagged transactions in the frontend `Transactions` page and view aggregated stats on the Dashboard.

## Next Steps / How to Extend

- Add authentication & RBAC for production safety.
- Add feature flags to toggle rules and thresholds at runtime.
- Add a rule testing harness so evaluators can simulate inputs and assert expected flags.

## Core features & optimizations I implemented (quick reference)

- Indexing: the schema includes indexes on `user_id`, `risk_flag`, and `timestamp` to accelerate velocity checks and time-sorted queries (`backend/prisma/schema.prisma`).
- Pagination: `GET /transactions` supports `page` and `pageSize` with server-side `skip`/`take` to avoid pulling all rows to the client. The frontend paginates with a default page size of 30.
- Validation middleware: `validateBody` (Zod-based) validates incoming `POST /transactions` payloads and returns friendly validation errors when payloads are malformed.
- Error handling: `errorMiddleware` centralizes error responses and returns structured JSON (`{ message, details }`).
- Multi-file upload: the UI and the API support uploading multiple CSVs at once. `UploadService.processMultipleFiles` processes them sequentially and returns per-file summaries.
- Duplicate removal: duplicates are detected via `transaction_id` lookups and skipped; the upload summary reports how many duplicates were found.
- Multiple-rule triggers: transactions can have multiple flags (`risk_flags`) and `rule_triggered` stores which rules matched. The UI displays both the primary flag and the full list of matched rules.
- Upload summary: the frontend shows a detailed per-file summary (inserted, duplicates, invalid rows, high-risk, suspicious counts).
- Frontend data strategy: the app uses `@tanstack/react-query` (React Query) for caching, retries, and background refetching. This keeps the UI responsive and reduces unnecessary network traffic.
- Notifications: `react-hot-toast` is used for success/error toasts during uploads and actions.
- Modularity & lazy-friendly UI: components are small and focused (`UploadSection`, `UploadSummary`, `TransactionsTable`, `TransactionRow`) so they are implemented to lazy-load or split into bundles later.
- Filters: server-side filtering by flag (`status` query param) avoids transferring extra rows to the client.