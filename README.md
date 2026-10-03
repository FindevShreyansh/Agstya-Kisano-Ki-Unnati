# AgriTech Platform

**Soil test → Crop recommendation → Farmer marketplace**

Node.js/Express backend + HTML/CSS/JavaScript frontend+ MySQL database.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Database Setup

```sql
-- In MySQL client:
source backend/src/db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set DB_PASSWORD to your MySQL root password

npm install
npm run seed       # seeds demo data (4 users + full demo journey)
npm run dev        # starts on http://localhost:8080
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

---

## 🔑 Demo Logins (password for all: `Demo@123`)

| Role | Email |
|---|---|
| ADMIN | admin@agritech.test |
| SOIL_EXPERT | expert@agritech.test |
| FARMER | farmer@agritech.test |
| BUYER | buyer@agritech.test |

---

## 🔬 Smoke Test

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@agritech.test","password":"Demo@123"}'
```

Expected: JSON with `token`, `userId`, `name`, `role`.

```bash
# Health check
curl http://localhost:8080/api/health
```

---

## 📁 Project Structure

```
agritech/
  backend/
    src/
      db/
        pool.js          # MySQL connection pool
        schema.sql       # All 9 tables
        seed.js          # Demo data seeder
      middleware/
        auth.js          # JWT authenticate + authorize
      routes/
        auth.js          # POST /api/auth/register|login, GET /api/auth/me
        farms.js         # Farm CRUD
        soil.js          # Soil test requests, reports, recommendation engine
        market.js        # Listings, price offers, purchase requests
        users.js         # Expert list, user list
        dashboard.js     # Farmer + Admin dashboard aggregation
      index.js           # Express app entry point
    package.json
    .env.example
  frontend/              # React + Vite (to be scaffolded)
  docs/
    API.md               # API contract
```

---

## 📚 Docs

- [`docs/API.md`](docs/API.md) — full API contract (read before writing frontend code)
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — git workflow for the team
