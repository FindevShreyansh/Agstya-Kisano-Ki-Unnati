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
