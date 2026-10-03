/**
 * Demo data seeder.
 * Run: node src/db/seed.js
 *
 * Creates one user per role and seeds the full demo journey
 * (farm → soil test → soil report → recommendations → listing → price offer → purchase request)
 * so the video demo can be recorded without any manual setup.
 *
 * Password for ALL demo accounts: Demo@123
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./pool');

const PASS = bcrypt.hashSync('Demo@123', 10);

async function seed() {
  const db = await pool.getConnection();
  try {
    await db.beginTransaction();

    // ---- Clear tables in safe order ----
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of [
      'purchase_requests','price_offers','crop_listings','crop_recommendations',
      'soil_reports','soil_test_requests','crop_profiles','reference_prices',
      'farms','users'
    ]) {
      await db.query(`TRUNCATE TABLE ${t}`);
    }
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // ---- Users ----
    const [uRes] = await db.query(
      `INSERT INTO users (name, email, phone, password, role) VALUES
        ('Admin User',      'admin@agritech.test',  '9000000001', ?, 'ADMIN'),
        ('Ravi Kumar',      'expert@agritech.test', '9000000002', ?, 'SOIL_EXPERT'),
        ('Ramesh Farmer',   'farmer@agritech.test', '9000000003', ?, 'FARMER'),
        ('Bharat Buyer',    'buyer@agritech.test',  '9000000004', ?, 'BUYER')`,
      [PASS, PASS, PASS, PASS]
    );
    const adminId  = 1;
    const expertId = 2;
    const farmerId = 3;
    const buyerId  = 4;

    // ---- Farm ----
    const [fRes] = await db.query(
      `INSERT INTO farms (farmer_id, location, district, state, area_acres) VALUES (?, ?, ?, ?, ?)`,
      [farmerId, 'Hebbur Village, Tumkur Taluk', 'Tumkur', 'Karnataka', 3.50]
    );
    const farmId = fRes.insertId;

    // ---- Soil test request (COMPLETED) ----
    const [strRes] = await db.query(
      `INSERT INTO soil_test_requests
        (farmer_id, farm_id, preferred_date, preferred_time, status, assigned_expert_id, scheduled_at)
       VALUES (?, ?, ?, ?, 'COMPLETED', ?, ?)`,
      [farmerId, farmId, '2026-10-05', 'Morning', expertId, '2026-10-06 09:00:00']
    );
    const requestId = strRes.insertId;

    // ---- Soil report ----
    const [srRes] = await db.query(
      `INSERT INTO soil_reports
        (request_id, sample_id, ph, nitrogen, phosphorus, potassium, organic_carbon, electrical_conductivity, soil_type, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [requestId, 'KA-TK-2026-001', 6.5, 90, 45, 55, 1.20, 0.42, 'Red Laterite']
    );
    const reportId = srRes.insertId;

    // ---- Crop profiles (ICAR guidelines) ----
    await db.query(
      `INSERT INTO crop_profiles
        (crop_name, ph_min, ph_max, n_min, n_max, p_min, p_max, k_min, k_max, oc_min, oc_max, season) VALUES
        ('Rice',      5.5, 7.0, 80,  120, 30, 60,  40, 80,  0.500, 1.500, 'Kharif'),
        ('Wheat',     6.0, 7.5, 100, 150, 50, 80,  40, 60,  0.800, 1.500, 'Rabi'),
        ('Maize',     5.5, 7.5, 100, 150, 50, 75,  40, 60,  0.600, 1.500, 'Kharif'),
        ('Cotton',    6.0, 8.0, 60,  100, 30, 60,  40, 80,  0.500, 1.000, 'Kharif'),
        ('Soybean',   6.0, 7.0, 20,  30,  60, 80,  40, 60,  1.000, 2.000, 'Kharif'),
        ('Groundnut', 6.0, 7.0, 20,  25,  40, 60,  40, 60,  0.500, 1.500, 'Kharif'),
        ('Tomato',    6.0, 7.0, 100, 150, 60, 80,  100,150, 1.000, 2.000, 'Annual'),
        ('Sugarcane', 6.0, 7.5, 150, 200, 60, 80,  100,150, 0.800, 1.500, 'Annual'),
        ('Turmeric',  5.5, 7.0, 60,  80,  40, 60,  120,150, 1.500, 2.500, 'Kharif'),
        ('Banana',    6.0, 7.5, 100, 150, 50, 80,  150,200, 1.000, 2.500, 'Annual')`
    );

    // ---- Crop recommendations (generated from pH 6.5, N 90, P 45, K 55, OC 1.20) ----
    await db.query(
      `INSERT INTO crop_recommendations
        (report_id, request_id, crop_name, suitability, score, reason) VALUES
        (?, ?, 'Rice',      'HIGH',   0.9200, 'pH 6.5 is ideal (5.5–7.0). Nitrogen 90 kg/ha is within range. Phosphorus and Potassium are within recommended levels. Excellent match for Karnataka Kharif season.'),
        (?, ?, 'Wheat',     'HIGH',   0.8800, 'pH 6.5 is ideal (6.0–7.5). All major nutrients are within acceptable range. Well suited for Rabi season.'),
        (?, ?, 'Maize',     'MEDIUM', 0.7100, 'pH 6.5 is ideal. Nitrogen is slightly below optimum. Consider top-dressing with urea after sowing.'),
        (?, ?, 'Groundnut', 'MEDIUM', 0.6300, 'pH and organic carbon are well suited. Nitrogen is higher than required — groundnut fixes its own nitrogen. Consider reducing N input.'),
        (?, ?, 'Cotton',    'LOW',    0.4800, 'pH and potassium are acceptable but soil nitrogen is below the recommended 60–100 range for cotton. Soil improvement recommended before planting.')`,
      [
        reportId, requestId,
        reportId, requestId,
        reportId, requestId,
        reportId, requestId,
        reportId, requestId,
      ]
    );

    // ---- Reference prices ----
    await db.query(
      `INSERT INTO reference_prices
        (crop_name, reference_price, quality_a_premium, quality_b_premium, quality_c_premium, demand_premium_pct, location_premium) VALUES
        ('Rice',      2200, 250, 100, 0,  5.0, 50),
        ('Wheat',     2275, 200, 80,  0,  4.0, 40),
        ('Maize',     2090, 150, 60,  0,  3.0, 30),
        ('Soybean',   4892, 400, 150, 0,  6.0, 80),
        ('Cotton',    7020, 500, 200, 0,  4.5, 60),
        ('Groundnut', 6783, 450, 180, 0,  5.0, 70),
        ('Tomato',     800, 100, 40,  0, 10.0, 20),
        ('Sugarcane',  315,  30, 10,  0,  2.0, 10),
        ('Turmeric',  7000, 600, 250, 0,  8.0, 100),
        ('Banana',    1500, 150, 60,  0,  7.0, 40)`
    );

    // ---- Crop listing (Ramesh lists his Rice harvest) ----
    const [clRes] = await db.query(
      `INSERT INTO crop_listings
        (farmer_id, crop_name, variety, quantity, unit, harvest_date, location, district, state, quality, image_url, expected_price, status, verified)
       VALUES (?, 'Rice', 'Sona Masoori', 500, 'kg', '2026-10-20', 'Hebbur Village, Tumkur Taluk', 'Tumkur', 'Karnataka', 'A', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/White_rice.jpg/800px-White_rice.jpg', 2200, 'AVAILABLE', 1)`,
      [farmerId]
    );
    const listingId = clRes.insertId;

    // ---- Price offer (auto-calculated) ----
    // Reference ₹2200 + Quality A premium ₹250 + Demand (5% of 2200 = ₹110) + Location ₹50 = ₹2610
    await db.query(
      `INSERT INTO price_offers (listing_id, reference_price, quality_premium, demand_premium, location_premium, platform_price)
       VALUES (?, 2200, 250, 110, 50, 2610)`,
      [listingId]
    );

    // ---- Purchase request (Bharat wants to buy) ----
    await db.query(
      `INSERT INTO purchase_requests (buyer_id, listing_id, quantity, offered_price, status)
       VALUES (?, ?, 200, 2600, 'PENDING')`,
      [buyerId, listingId]
    );

    await db.commit();
    console.log('✅ Demo data seeded successfully.');
    console.log('');
    console.log('Demo logins (password: Demo@123)');
    console.log('  admin@agritech.test  → ADMIN');
    console.log('  expert@agritech.test → SOIL_EXPERT');
    console.log('  farmer@agritech.test → FARMER');
    console.log('  buyer@agritech.test  → BUYER');
  } catch (err) {
    await db.rollback();
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    db.release();
    process.exit(0);
  }
}

seed();
