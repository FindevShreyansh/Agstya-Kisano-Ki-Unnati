# AgriTech API Contract (v0.2)

> **Stack:** Node.js + Express.js + MySQL  
> Updated from v0.1 (Spring Boot) to v0.2 (Node.js).

This file is the agreement between backend and frontend. If you change an endpoint, update this file first and tell the team.

---

## Conventions

- Base path `/api`, JSON in and out.
- Auth header: `Authorization: Bearer <token>` (from login response).
- Roles: `FARMER`, `SOIL_EXPERT`, `BUYER`, `ADMIN`. Only `FARMER` and `BUYER` can self-register.
- Money: rupees per quintal. Dates: ISO `2026-10-20`. Numbers: always parsed to float in responses.
- Error format: `{ "status": 400, "message": "..." }`
- UI wording: "Platform Assured Price" / "Reference Market Price". **Never** label a platform price as MSP.

---

## Module Ownership

| Route file | Owner | Notes |
|---|---|---|
| `auth.js` | Claude | Done |
| `farms.js` | Claude | Done |
| `soil.js` | Claude | Done — includes recommendation engine |
| `market.js` | Claude | Done — includes price engine |
| `users.js` | Claude | Done |
| `dashboard.js` | Claude | Done |
| `frontend/` | Dev 1, 2, 3 | All three devs build pages |

---

## Auth

| Method | Path | Who | Body / Response |
|---|---|---|---|
| POST | `/api/auth/register` | public | `{name,email,phone,password,role}` → `{token,userId,name,role}` |
| POST | `/api/auth/login` | public | `{email,password}` → `{token,userId,name,role}` |
| GET | `/api/auth/me` | any auth | `{userId,email,name,role}` |

---

## Farms

| Method | Path | Who | Notes |
|---|---|---|---|
| POST | `/api/farms` | FARMER | `{location,district,state,areaAcres}` |
| GET | `/api/farms/mine` | FARMER | Own farms |
| GET | `/api/farms/:id` | FARMER (own) / ADMIN | — |
| GET | `/api/farms` | ADMIN | All farms with farmer name |

---

## Soil Tests

**Status flow:** `PENDING → ASSIGNED → SCHEDULED → SAMPLE_COLLECTED → LAB_PROCESSING → COMPLETED`

| Transition | Who | Extra fields |
|---|---|---|
| PENDING → ASSIGNED | ADMIN | `expertId` |
| ASSIGNED → SCHEDULED | ADMIN | `scheduledAt` |
| SCHEDULED → SAMPLE_COLLECTED | assigned SOIL_EXPERT or ADMIN | — |
| SAMPLE_COLLECTED → LAB_PROCESSING | ADMIN | — |
| LAB_PROCESSING → COMPLETED | ADMIN (via POST report endpoint) | lab values |

| Method | Path | Who |
|---|---|---|
| POST | `/api/soil/requests` | FARMER — `{farmId, preferredDate, preferredTime}` |
| GET | `/api/soil/requests/mine` | FARMER |
| GET | `/api/soil/requests/assigned` | SOIL_EXPERT |
| GET | `/api/soil/requests?status=` | ADMIN |
| GET | `/api/soil/requests/:id` | owner FARMER / assigned EXPERT / ADMIN |
| PATCH | `/api/soil/requests/:id/status` | see transition table — `{status, expertId?, scheduledAt?}` |
| POST | `/api/soil/requests/:id/report` | ADMIN — lab values; sets COMPLETED and generates recommendations |
| GET | `/api/soil/requests/:id/report` | owner FARMER / ADMIN |

**Lab report body:**
```json
{
  "sampleId": "KA-TK-2026-001",
  "ph": 6.5,
  "nitrogen": 90,
  "phosphorus": 45,
  "potassium": 55,
  "organicCarbon": 1.2,
  "electricalConductivity": 0.42,
  "soilType": "Red Laterite"
}
```

---

## Crop Recommendations

Auto-generated when lab report is submitted. Rule-based engine: scores each of 10 crops against pH, N, P, K, OC using ICAR ranges. Weighted average → HIGH (≥0.75) / MEDIUM (≥0.5) / LOW.

| Method | Path | Who |
|---|---|---|
| GET | `/api/soil/recommendations?requestId=` | owner FARMER / ADMIN |

---

## Market

**Platform Assured Price = Reference Price + Quality Premium + Demand Premium + Location Premium**

| Method | Path | Who |
|---|---|---|
| POST | `/api/market/listings` | FARMER — also auto-creates price offer |
| GET | `/api/market/listings?q=&crop=&state=&district=&quality=&minPrice=&maxPrice=` | any auth |
| GET | `/api/market/listings/mine` | FARMER |
| GET | `/api/market/listings/:id` | any auth |
| GET | `/api/market/listings/:id/offer` | owner FARMER / ADMIN |
| PATCH | `/api/market/listings/:id/verify` | ADMIN |
| POST | `/api/market/purchase-requests` | BUYER — `{listingId, quantity, offeredPrice}` |
| GET | `/api/market/purchase-requests/mine` | BUYER |
| GET | `/api/market/purchase-requests/received` | FARMER |
| PATCH | `/api/market/purchase-requests/:id/status` | FARMER — `{status: "ACCEPTED"/"REJECTED"}` |
| GET | `/api/market/reference-prices` | ADMIN |
| PUT | `/api/market/reference-prices/:id` | ADMIN |

**Listing body:**
```json
{
  "cropName": "Rice",
  "variety": "Sona Masoori",
  "quantity": 500,
  "unit": "kg",
  "harvestDate": "2026-10-20",
  "location": "Hebbur Village",
  "district": "Tumkur",
  "state": "Karnataka",
  "quality": "A",
  "imageUrl": "https://...",
  "expectedPrice": 2200
}
```

---

## Users

| Method | Path | Who |
|---|---|---|
| GET | `/api/users/experts` | ADMIN — for the assign-expert dropdown |
| GET | `/api/users` | ADMIN — all users |

---

## Dashboards

| Method | Path | Who | Returns |
|---|---|---|---|
| GET | `/api/dashboard/farmer` | FARMER | farms, soilRequests, soilReports (with recs), listings, purchaseRequestsReceived |
| GET | `/api/dashboard/admin` | ADMIN | stats counts + recentSoilRequests + recentListings |

---

## Must-Have vs Stretch

- **Must (all done in backend):** everything in the tables above.
- **Stretch (cut if time runs short):** file upload for lab reports, charts in admin panel, fertilizer advice text, regional language toggle.
