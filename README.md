# 🌾 Agstya — Kisano Ki Unnati

> A full-stack agritech platform that connects **farmers**, **buyers**, and **soil experts** — enabling soil health testing, AI-powered crop recommendations, and a transparent digital marketplace for agricultural produce.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Demo Accounts](#-demo-accounts)
- [API Reference](#-api-reference)
  - [Authentication](#authentication)
  - [Farms](#farms)
  - [Soil Testing](#soil-testing)
  - [Marketplace](#marketplace)
  - [Dashboards](#dashboards)
- [Project Structure](#-project-structure)
- [How the Recommendation Engine Works](#-how-the-recommendation-engine-works)
- [How the Pricing Engine Works](#-how-the-pricing-engine-works)
- [Future Enhancements](#-future-enhancements)
- [Team & Contributing](#-team--contributing)
- [License](#-license)

---

## 🌍 Overview

Indian farmers often lack access to reliable soil health data, fair pricing, and direct buyer connections. **Agstya** addresses this by providing:

1. **Soil Testing Workflow** — Farmers request soil tests, admins assign experts, and lab results auto-generate crop suitability recommendations based on ICAR (Indian Council of Agricultural Research) guidelines.
2. **Smart Marketplace** — Farmers list their produce, and the platform calculates a "Platform Assured Price" based on reference prices, quality grade, demand, and location premiums.
3. **Buyer-Farmer Direct Connect** — Buyers browse listings, submit purchase requests, and farmers accept/reject — eliminating middlemen.

---

## ✨ Features

### For Farmers 👨‍🌾
- Register and manage farm profiles
- Request soil testing for registered farms
- View lab reports with pH, nitrogen, phosphorus, potassium, organic carbon analysis
- Get crop recommendations scored and ranked by soil suitability
- List crops for sale with quality grades (A/B/C)
- Receive and manage purchase requests from buyers
- Dashboard with consolidated farm, soil, listing, and procurement data

### For Buyers 🛒
- Browse the crop marketplace with search and filters (crop, state, district, quality, price range)
- Submit purchase requests on available listings
- Track request status (Pending / Accepted / Rejected)
- Create bulk procurement requirements in kilograms or quintals
- Compare lowest-cost, balanced, and fewest-farmers sourcing plans
- See farmer trust scores, estimated distance, produce subtotal, and logistics estimate

### For Soil Experts 🔬
- View assigned soil test requests with farm and farmer details
- Update sample collection status in the field

### For Admins 🛡️
- Manage all users, farms, soil requests, and listings
- Assign soil experts to test requests
- Submit lab reports (auto-triggers crop recommendations)
- Configure reference prices and premiums per crop
- Admin dashboard with platform-wide statistics
- Resolve procurement disputes using documented outcomes that update farmer trust

### Bulk Procurement and Trust

Bulk requirements are normalized to kilograms and match only available inventory. Buyers specify crop,
minimum quality, delivery place/date, optional produce budget, and maximum farmers. The engine produces
three explainable plans and does not reserve stock during preview. After a buyer confirms a plan, each
farmer accepts or rejects their allocation; inventory is reserved atomically only after acceptance.

Farmer trust starts at `0.50` and uses Bayesian smoothing:

```text
trust = (1 + positive outcomes) / (2 + positive outcomes + negative outcomes)
```

Completed orders and disputes resolved in the farmer's favour are positive. Farmer-attributed
cancellations and disputes resolved in the buyer's favour are negative. Dismissed and open disputes
are neutral. Bands are LOW (`<0.40`), MEDIUM (`0.40–0.74`), and HIGH (`>=0.75`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Tailwind CSS v4, Vite 7 |
| **Backend** | Node.js, Express.js 4 |
| **Database** | MySQL 8 (with `mysql2/promise` driver) |
| **Authentication** | JWT (JSON Web Tokens) + bcrypt password hashing |
| **Validation** | Manual validation (express-validator available for extension) |
| **Dev Tools** | Nodemon (auto-restart), ESLint, Vite HMR |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│              (Vite dev server — :5173)                │
│                                                      │
│  Pages: Home, RoleSelection, FarmerDashboard,        │
│         BuyerDashboard, AdminDashboard, ...          │
│  API Client: src/api.js (fetch + Bearer token)       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (JSON)
                       ▼
┌──────────────────────────────────────────────────────┐
│                 Express.js Backend                    │
│               (API server — :8080)                    │
│                                                      │
│  Middleware: CORS → JSON parser → Auth (JWT verify)   │
│                                                      │
│  Routes:                                             │
│    /api/auth      → Register, Login, Me              │
│    /api/farms     → CRUD for farm profiles           │
│    /api/soil      → Test requests, reports, recs     │
│    /api/market    → Listings, offers, purchases      │
│    /api/users     → Admin user management            │
│    /api/dashboard → Aggregated dashboard data        │
│                                                      │
│  Engines:                                            │
│    Recommendation Engine (ICAR-based scoring)        │
│    Pricing Engine (Reference + Premiums)             │
└──────────────────────┬──────────────────────────────┘
                       │ mysql2/promise (Connection Pool)
                       ▼
┌──────────────────────────────────────────────────────┐
│                     MySQL 8                           │
│                                                      │
│  Tables: users, farms, soil_test_requests,           │
│          soil_reports, crop_profiles,                 │
│          crop_recommendations, reference_prices,      │
│          crop_listings, price_offers,                 │
│          purchase_requests                            │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | v9 or higher | Comes with Node.js |
| **MySQL** | v8.0 or higher | [dev.mysql.com](https://dev.mysql.com/downloads/) |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FindevShreyansh/Agstya-Kisano-Ki-Unnati.git
   cd Agstya-Kisano-Ki-Unnati
   ```

2. **Install all dependencies** (both backend and frontend in one command)
   ```bash
   npm run install:all
   ```
   Or install them separately:
   ```bash
   cd backend && npm install
   cd ../react-frontend && npm install
   ```

3. **Configure environment variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `backend/.env` with your MySQL credentials:
   ```env
   PORT=8080
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=agritech
   JWT_SECRET=change-this-to-a-long-random-string
   JWT_EXPIRES_IN=7d
   ```

### Database Setup

1. **Create the database and tables**

   Open MySQL and run the schema file:
   ```bash
   mysql -u root -p < backend/src/db/schema.sql
   ```
   Or copy-paste the contents of `backend/src/db/schema.sql` into MySQL Workbench / phpMyAdmin.

2. **Seed demo data** (optional but recommended for testing)
   ```bash
   cd backend
   npm run seed
   ```
   This creates demo users, a farm, a completed soil test with recommendations, a crop listing with pricing, and a purchase request — so you can explore the full workflow immediately.

### Running the App

You need **two terminal windows** — one for the backend and one for the frontend:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
> 🌱 Server starts at `http://localhost:8080`
> Health check: `http://localhost:8080/api/health`

**Terminal 2 — Frontend:**
```bash
cd react-frontend
npm run dev
```
> ⚡ Frontend starts at `http://localhost:5173`

Open `http://localhost:5173` in your browser — you're good to go!

---

## 🔑 Demo Accounts

After running `npm run seed`, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | `admin@agritech.test` | `Demo@123` |
| 🔬 Soil Expert | `expert@agritech.test` | `Demo@123` |
| 👨‍🌾 Farmer | `farmer@agritech.test` | `Demo@123` |
| 🛒 Buyer | `buyer@agritech.test` | `Demo@123` |

> The seeded farmer (Ramesh) already has a farm, a completed soil test with crop recommendations, a rice listing with platform pricing, and a pending purchase request from the buyer.

---

## 📡 API Reference

**Base URL:** `http://localhost:8080/api`

All endpoints return JSON. Protected routes require: `Authorization: Bearer <token>`

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register (FARMER or BUYER only) |
| `POST` | `/auth/login` | Public | Login → returns JWT token |
| `GET` | `/auth/me` | Authenticated | Get current user info |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123",
  "role": "FARMER"
}
```

### Farms

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/farms` | FARMER | Create a farm |
| `GET` | `/farms/mine` | FARMER | List own farms |
| `GET` | `/farms/:id` | FARMER (own) / ADMIN | Get farm details |
| `GET` | `/farms` | ADMIN | List all farms |

### Soil Testing

**Status flow:** `PENDING → ASSIGNED → SCHEDULED → SAMPLE_COLLECTED → LAB_PROCESSING → COMPLETED`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/soil/requests` | FARMER | Create soil test request |
| `GET` | `/soil/requests/mine` | FARMER | List own requests |
| `GET` | `/soil/requests/assigned` | SOIL_EXPERT | List assigned requests |
| `GET` | `/soil/requests?status=` | ADMIN | Filter requests by status |
| `GET` | `/soil/requests/:id` | Owner / Expert / ADMIN | Get request details |
| `PATCH` | `/soil/requests/:id/status` | Varies (see status flow) | Advance request status |
| `POST` | `/soil/requests/:id/report` | ADMIN | Submit lab report → auto-generates crop recommendations |
| `GET` | `/soil/requests/:id/report` | Owner FARMER / ADMIN | Get lab report |
| `GET` | `/soil/recommendations?requestId=` | Owner FARMER / ADMIN | Get crop recommendations |

### Marketplace

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/market/listings` | FARMER | Create listing (auto-calculates platform price) |
| `GET` | `/market/listings` | Authenticated | Search listings (filters: `q`, `crop`, `state`, `district`, `quality`, `minPrice`, `maxPrice`) |
| `GET` | `/market/listings/mine` | FARMER | Own listings with price breakdowns |
| `GET` | `/market/listings/:id` | Authenticated | Listing details |
| `GET` | `/market/listings/:id/offer` | Owner / ADMIN | Price offer breakdown |
| `PATCH` | `/market/listings/:id/verify` | ADMIN | Verify a listing |
| `POST` | `/market/purchase-requests` | BUYER | Submit purchase request |
| `GET` | `/market/purchase-requests/mine` | BUYER | Own purchase requests |
| `GET` | `/market/purchase-requests/received` | FARMER | Incoming purchase requests |
| `PATCH` | `/market/purchase-requests/:id/status` | FARMER | Accept or reject a purchase request |
| `GET` | `/market/reference-prices` | ADMIN | View all reference prices |
| `PUT` | `/market/reference-prices/:id` | ADMIN | Update reference price config |

### Bulk Procurement

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/bulk/places?q=` | Authenticated | Search supported delivery places |
| `POST` | `/bulk/requirements/plan` | BUYER | Create a requirement and generate three sourcing plans |
| `GET` | `/bulk/requirements/mine` | BUYER | View requirements, plans, and allocations |
| `POST` | `/bulk/requirements/:id/confirm` | BUYER | Confirm one plan and notify its farmers |
| `GET` | `/bulk/allocations/received` | FARMER | View selected-plan allocations |
| `PATCH` | `/bulk/allocations/:id/status` | FARMER | Accept/reject an allocation and reserve stock on acceptance |
| `GET` | `/bulk/trust/:farmerId` | Authenticated | View a farmer's trust score and explanation |
| `PATCH` | `/bulk/orders/:id/status` | BUYER/FARMER/ADMIN | Advance an order or raise a dispute |
| `GET` | `/bulk/orders/disputes` | ADMIN | View open procurement disputes |
| `PATCH` | `/bulk/orders/:id/resolve` | ADMIN | Resolve a disputed order |

### Dashboards

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/dashboard/farmer` | FARMER | Full farmer dashboard (farms, tests, reports, listings, requests) |
| `GET` | `/dashboard/admin` | ADMIN | Platform stats + recent activity |

---

## 📂 Project Structure

```
agritech/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── pool.js          # MySQL connection pool (10 connections)
│   │   │   ├── schema.sql       # Database schema (10 tables)
│   │   │   └── seed.js          # Demo data seeder
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication + RBAC authorization
│   │   ├── routes/
│   │   │   ├── auth.js          # Register, Login, Me
│   │   │   ├── farms.js         # Farm CRUD
│   │   │   ├── soil.js          # Soil tests + Recommendation engine
│   │   │   ├── market.js        # Listings + Pricing engine + Purchases
│   │   │   ├── users.js         # Admin user management
│   │   │   └── dashboard.js     # Aggregated dashboard endpoints
│   │   └── index.js             # Express app entry point
│   ├── uploads/                 # Placeholder for file uploads (future)
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── react-frontend/
│   ├── src/
│   │   ├── pages/               # 24 page components
│   │   ├── components/          # Shared components (AdminLayout, NotificationCenter)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── data/                # Static data files
│   │   ├── api.js               # API client (fetch wrapper with auth)
│   │   ├── App.jsx              # Route definitions
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   └── API.md                   # API contract document
├── CONTRIBUTING.md              # Git workflow guide
├── package.json                 # Root-level scripts
└── .gitignore
```

---

## 🧪 How the Recommendation Engine Works

When a lab report is submitted, the backend automatically generates crop recommendations:

1. **Soil parameters analyzed:** pH, Nitrogen (N), Phosphorus (P), Potassium (K), Organic Carbon (OC)
2. **Reference data:** 10 crop profiles with ICAR-recommended ranges (stored in `crop_profiles` table)
3. **Scoring:** Each soil parameter is scored 0.0 to 1.0 against the crop's ideal range
4. **Weighting:** pH (25%), Nitrogen (25%), Phosphorus (20%), Potassium (20%), Organic Carbon (10%)
5. **Classification:**
   - **HIGH** suitability: score ≥ 0.75
   - **MEDIUM** suitability: score ≥ 0.50
   - **LOW** suitability: score < 0.50
6. **Output:** Each crop gets a score, suitability level, and a human-readable explanation

**Example:** For soil with pH 6.5, N 90, P 45, K 55, OC 1.20 → Rice scores 0.92 (HIGH), Wheat 0.88 (HIGH), Maize 0.71 (MEDIUM)

---

## 💰 How the Pricing Engine Works

When a farmer lists a crop, the platform auto-calculates a "Platform Assured Price":

```
Platform Assured Price = Reference Price
                       + Quality Premium (A/B/C grade)
                       + Demand Premium (% of reference price)
                       + Location Premium (flat amount)
```

**Example:** Rice, Quality A
- Reference Price: ₹2,200/quintal
- Quality A Premium: +₹250
- Demand Premium (5%): +₹110
- Location Premium: +₹50
- **Platform Assured Price: ₹2,610/quintal**

All premiums are admin-configurable via the reference prices API.

---

## 🔮 Future Enhancements

- **File Upload** — Lab report PDF uploads (multer is already set up)
- **Admin Analytics** — Charts and graphs in the admin dashboard
- **Fertilizer Advice** — Specific fertilizer recommendations based on soil deficiencies
- **Regional Language Support** — Hindi, Kannada, Telugu UI toggle
- **Weather Integration** — Real-time weather data for crop planning
- **Payment Gateway** — Online payment for crop transactions
- **Mobile App** — React Native / Flutter mobile application
- **Notification System** — Email/SMS alerts for status updates

---

## 👥 Team & Contributing
* **Rahul Raj** 
* **Gaurav Gupta**
* **Md. Sahid**
* **Deepankar Kumar** 
* **Shreyansh Kumar**   

See [CONTRIBUTING.md](CONTRIBUTING.md) for our Git workflow and branching conventions.

**Project:** Agstya — Kisano Ki Unnati (अगस्त्य — किसानों की उन्नति)

---

## 📄 License

This project was built for a hackathon. All rights reserved by the team.
