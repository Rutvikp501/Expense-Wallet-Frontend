# Departmental Expense Wallets — PERN Stack

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

## 1. Database Setup
```bash
psql -U postgres -c "CREATE DATABASE expense_wallets;"
```

## 2. Environment Setup
```bash
# backend/.env
PG_HOST=localhost
PG_PORT=5432
PG_NAME=expense_wallets
PG_USER=postgres
PG_PASSWORD=yourpassword
PORT=4000
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:4000/api
```

## 3. Backend Setup
```bash
cd backend
npm install
node scripts/seed.js       # runs schema.sql then seed.sql
```

## 4. Start Backend
```bash
npm start
# Server on http://localhost:4000
```

## 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# UI on http://localhost:5173
```

## 6. Run Tests

### Unit + integration tests (requires running server + seeded DB)
```bash
cd backend
npm test
```

### Concurrency tests
```bash
# Reset wallet balances first
psql -d expense_wallets -U postgres -c "UPDATE wallets SET balance=50000 WHERE id=1;"
psql -d expense_wallets -U postgres -c "DELETE FROM payment_requests WHERE wallet_id=1;"
psql -d expense_wallets -U postgres -c "DELETE FROM wallet_ledger WHERE wallet_id=1;"
psql -d expense_wallets -U postgres -c "DELETE FROM idempotency_keys;"

# Run concurrency test
npx jest tests/concurrency.test.js --verbose
```

## 7. Verify Results
```bash
psql -d expense_wallets -U postgres -c "SELECT id, balance FROM wallets;"
psql -d expense_wallets -U postgres -c "SELECT status, COUNT(*) FROM payment_requests GROUP BY status;"
```