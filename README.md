# Mini Transaction Risk Monitoring System

## Overview
A lightweight transaction monitoring system that detects basic fraud patterns and provides dashboard statistics.

## Tech Stack
- Backend: Node.js, Express, TypeScript, Prisma, SQLite
- Frontend: React, TypeScript
- Database: SQLite (relational)

## Architecture
Single-service REST architecture.
Clear separation between:
- Controllers
- Services (fraud logic)
- Data layer (Prisma)

## Fraud Rules
Rule1:
If amount > 20000 ? HIGH_RISK

Rule2:
If more than 3 transactions per user ? SUSPICIOUS

## Setup

### Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Assumptions
- No authentication required.
- All timestamps are ISO format.
- Single rule applied per transaction (priority based).

## Scaling to 1M Transactions/Day
- Move to PostgreSQL
- **Index timestamp column** (already added) to avoid full table scans when sorting
- Perform `ORDER BY timestamp ASC`/take/skip on the database instead of pulling and sorting all rows in the client (earliest first)
- Add read replicas
- Introduce async processing queue
- Add database partitioning
- Horizontal scaling behind load balancer