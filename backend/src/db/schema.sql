-- ============================================================
-- AgriTech Platform — MySQL Schema
-- Run this once to create all tables.
-- Then run: node src/db/seed.js  to populate demo data.
-- ============================================================

CREATE DATABASE IF NOT EXISTS agritech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agritech;

-- ---- Users ----
CREATE TABLE IF NOT EXISTS users (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(20),
  password     VARCHAR(255) NOT NULL,
  role         ENUM('FARMER','BUYER','SOIL_EXPERT','ADMIN') NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---- Farms ----
CREATE TABLE IF NOT EXISTS farms (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  farmer_id    BIGINT NOT NULL,
  location     VARCHAR(255) NOT NULL,
  district     VARCHAR(100) NOT NULL,
  state        VARCHAR(100) NOT NULL,
  area_acres   DECIMAL(8,2) NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id)
);

-- ---- Soil Test Requests ----
CREATE TABLE IF NOT EXISTS soil_test_requests (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  farmer_id           BIGINT NOT NULL,
  farm_id             BIGINT NOT NULL,
  preferred_date      DATE,
  preferred_time      VARCHAR(20),
  status              ENUM('PENDING','ASSIGNED','SCHEDULED','SAMPLE_COLLECTED','LAB_PROCESSING','COMPLETED') DEFAULT 'PENDING',
  assigned_expert_id  BIGINT,
  scheduled_at        DATETIME,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id),
  FOREIGN KEY (farm_id)   REFERENCES farms(id)
);

-- ---- Soil Reports ----
CREATE TABLE IF NOT EXISTS soil_reports (
  id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
  request_id              BIGINT NOT NULL UNIQUE,
  sample_id               VARCHAR(50),
  ph                      DECIMAL(4,2),
  nitrogen                DECIMAL(8,2),
  phosphorus              DECIMAL(8,2),
  potassium               DECIMAL(8,2),
  organic_carbon          DECIMAL(5,3),
  electrical_conductivity DECIMAL(6,3),
  soil_type               VARCHAR(100),
  report_file_url         VARCHAR(500),
  verified                TINYINT(1) DEFAULT 0,
  created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES soil_test_requests(id)
);

-- ---- Crop Profiles (ICAR ranges, seeded) ----
CREATE TABLE IF NOT EXISTS crop_profiles (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  crop_name   VARCHAR(100) NOT NULL UNIQUE,
  ph_min      DECIMAL(4,2), ph_max DECIMAL(4,2),
  n_min       DECIMAL(8,2), n_max  DECIMAL(8,2),
  p_min       DECIMAL(8,2), p_max  DECIMAL(8,2),
  k_min       DECIMAL(8,2), k_max  DECIMAL(8,2),
  oc_min      DECIMAL(5,3), oc_max DECIMAL(5,3),
  season      VARCHAR(50)
);

-- ---- Crop Recommendations ----
CREATE TABLE IF NOT EXISTS crop_recommendations (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  report_id    BIGINT NOT NULL,
  request_id   BIGINT NOT NULL,
  crop_name    VARCHAR(100) NOT NULL,
  suitability  ENUM('HIGH','MEDIUM','LOW') NOT NULL,
  score        DECIMAL(5,4),
  reason       TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id)  REFERENCES soil_reports(id),
  FOREIGN KEY (request_id) REFERENCES soil_test_requests(id)
);

-- ---- Reference Prices (admin-configurable, seeded) ----
CREATE TABLE IF NOT EXISTS reference_prices (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  crop_name           VARCHAR(100) NOT NULL UNIQUE,
  reference_price     DECIMAL(10,2) NOT NULL,
  quality_a_premium   DECIMAL(10,2) DEFAULT 0,
  quality_b_premium   DECIMAL(10,2) DEFAULT 0,
  quality_c_premium   DECIMAL(10,2) DEFAULT 0,
  demand_premium_pct  DECIMAL(5,2)  DEFAULT 0,
  location_premium    DECIMAL(10,2) DEFAULT 0,
  updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---- Crop Listings ----
CREATE TABLE IF NOT EXISTS crop_listings (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  farmer_id      BIGINT NOT NULL,
  crop_name      VARCHAR(100) NOT NULL,
  variety        VARCHAR(100),
  quantity       DECIMAL(10,2) NOT NULL,
  unit           VARCHAR(20) DEFAULT 'kg',
  harvest_date   DATE,
  location       VARCHAR(255),
  district       VARCHAR(100),
  state          VARCHAR(100),
  quality        ENUM('A','B','C') NOT NULL,
  image_url      VARCHAR(500),
  expected_price DECIMAL(10,2),
  status         ENUM('AVAILABLE','RESERVED','SOLD') DEFAULT 'AVAILABLE',
  verified       TINYINT(1) DEFAULT 0,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id)
);

-- ---- Price Offers (auto-generated when listing is created) ----
CREATE TABLE IF NOT EXISTS price_offers (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  listing_id        BIGINT NOT NULL UNIQUE,
  reference_price   DECIMAL(10,2),
  quality_premium   DECIMAL(10,2),
  demand_premium    DECIMAL(10,2),
  location_premium  DECIMAL(10,2),
  platform_price    DECIMAL(10,2),
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES crop_listings(id)
);

-- ---- Purchase Requests ----
CREATE TABLE IF NOT EXISTS purchase_requests (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  buyer_id       BIGINT NOT NULL,
  listing_id     BIGINT NOT NULL,
  quantity       DECIMAL(10,2) NOT NULL,
  offered_price  DECIMAL(10,2),
  status         ENUM('PENDING','ACCEPTED','REJECTED') DEFAULT 'PENDING',
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id)   REFERENCES users(id),
  FOREIGN KEY (listing_id) REFERENCES crop_listings(id)
);

-- ---- Bulk procurement and trust ----
SET @available_quantity_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'crop_listings'
    AND column_name = 'available_quantity'
);
SET @available_quantity_sql = IF(
  @available_quantity_exists = 0,
  'ALTER TABLE crop_listings ADD COLUMN available_quantity DECIMAL(10,2) NULL',
  'SELECT 1'
);
PREPARE add_available_quantity FROM @available_quantity_sql;
EXECUTE add_available_quantity;
DEALLOCATE PREPARE add_available_quantity;

CREATE TABLE IF NOT EXISTS place_catalog (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  state      VARCHAR(100) NOT NULL,
  district   VARCHAR(100) NOT NULL,
  city       VARCHAR(100) NOT NULL,
  aliases    VARCHAR(500),
  UNIQUE KEY place_name (state, district, city)
);

CREATE TABLE IF NOT EXISTS bulk_requirements (
  id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
  buyer_id              BIGINT NOT NULL,
  crop_name             VARCHAR(100) NOT NULL,
  variety               VARCHAR(100),
  quantity_kg           DECIMAL(12,2) NOT NULL,
  minimum_quality       ENUM('A','B','C') NOT NULL,
  delivery_state        VARCHAR(100) NOT NULL,
  delivery_district     VARCHAR(100) NOT NULL,
  delivery_city         VARCHAR(100) NOT NULL,
  delivery_date         DATE NOT NULL,
  max_budget            DECIMAL(12,2),
  max_farmers           INT DEFAULT 6,
  partial_fulfillment   TINYINT(1) DEFAULT 0,
  status                ENUM('DRAFT','PLANNED','CONFIRMED','COMPLETED','CANCELLED') DEFAULT 'DRAFT',
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bulk_plans (
  id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
  requirement_id        BIGINT NOT NULL,
  plan_type             ENUM('LOWEST_COST','BALANCED','FEWEST_FARMERS') NOT NULL,
  requested_quantity_kg DECIMAL(12,2) NOT NULL,
  allocated_quantity_kg DECIMAL(12,2) NOT NULL,
  remaining_quantity_kg DECIMAL(12,2) NOT NULL,
  farmer_count          INT NOT NULL,
  produce_subtotal      DECIMAL(12,2) NOT NULL,
  logistics_estimate    DECIMAL(12,2) NOT NULL,
  total_cost            DECIMAL(12,2) NOT NULL,
  score                 DECIMAL(14,2) NOT NULL,
  selected              TINYINT(1) DEFAULT 0,
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requirement_id) REFERENCES bulk_requirements(id)
);

CREATE TABLE IF NOT EXISTS bulk_allocations (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  plan_id        BIGINT NOT NULL,
  listing_id     BIGINT NOT NULL,
  farmer_id      BIGINT NOT NULL,
  quantity_kg    DECIMAL(12,2) NOT NULL,
  unit_price     DECIMAL(12,2) NOT NULL,
  subtotal       DECIMAL(12,2) NOT NULL,
  distance_km    DECIMAL(10,2) NOT NULL,
  status         ENUM('PENDING','ACCEPTED','REJECTED') DEFAULT 'PENDING',
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES bulk_plans(id),
  FOREIGN KEY (listing_id) REFERENCES crop_listings(id),
  FOREIGN KEY (farmer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS procurement_orders (
  id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
  buyer_id              BIGINT NOT NULL,
  farmer_id             BIGINT NOT NULL,
  listing_id            BIGINT NOT NULL,
  allocation_id         BIGINT,
  quantity_kg           DECIMAL(12,2) NOT NULL,
  status                ENUM('CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','DISPUTED','RESOLVED') DEFAULT 'CONFIRMED',
  cancellation_actor    ENUM('BUYER','FARMER','PLATFORM'),
  dispute_outcome       ENUM('BUYER_FAVOR','FARMER_FAVOR','DISMISSED'),
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (farmer_id) REFERENCES users(id),
  FOREIGN KEY (listing_id) REFERENCES crop_listings(id),
  FOREIGN KEY (allocation_id) REFERENCES bulk_allocations(id)
);

CREATE TABLE IF NOT EXISTS procurement_order_events (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id    BIGINT NOT NULL,
  event_type  ENUM('CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','DISPUTED','RESOLVED') NOT NULL,
  actor_role  ENUM('BUYER','FARMER','ADMIN','PLATFORM') NOT NULL,
  notes       TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES procurement_orders(id)
);
