const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// ---- Crop Listings ----

// POST /api/market/listings  — FARMER creates listing + auto-generates price offer
router.post('/listings', authenticate, authorize('FARMER'), async (req, res) => {
  const { cropName, variety, quantity, unit, harvestDate, location, district, state, quality, imageUrl, expectedPrice } = req.body;
  if (!cropName || !quantity || !quality) {
    return res.status(400).json({ status: 400, message: 'cropName, quantity and quality are required' });
  }

  const [listRes] = await pool.query(
    `INSERT INTO crop_listings
      (farmer_id, crop_name, variety, quantity, unit, harvest_date, location, district, state, quality, image_url, expected_price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, cropName, variety || null, quantity, unit || 'kg',
     harvestDate || null, location || null, district || null, state || null,
     quality, imageUrl || null, expectedPrice || null]
  );
  const listingId = listRes.insertId;

  // Auto-generate Platform Assured Price
  const offer = await calculateOffer(listingId, cropName, quality);

  const [rows] = await pool.query('SELECT * FROM crop_listings WHERE id = ?', [listingId]);
  res.status(201).json({ ...toListingResponse(rows[0]), priceOffer: offer });
});

// GET /api/market/listings  — search/filter (any authenticated user)
router.get('/listings', authenticate, async (req, res) => {
  const { q, crop, state, district, quality, minPrice, maxPrice } = req.query;
  let sql = `SELECT l.*, u.name AS farmer_name, po.platform_price
             FROM crop_listings l
             JOIN users u ON u.id = l.farmer_id
             LEFT JOIN price_offers po ON po.listing_id = l.id
             WHERE l.status = 'AVAILABLE'`;
  const params = [];

  if (q)        { sql += ' AND (l.crop_name LIKE ? OR l.variety LIKE ? OR l.location LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (crop)     { sql += ' AND l.crop_name = ?'; params.push(crop); }
  if (state)    { sql += ' AND l.state = ?'; params.push(state); }
  if (district) { sql += ' AND l.district = ?'; params.push(district); }
  if (quality)  { sql += ' AND l.quality = ?'; params.push(quality); }
  if (minPrice) { sql += ' AND po.platform_price >= ?'; params.push(minPrice); }
  if (maxPrice) { sql += ' AND po.platform_price <= ?'; params.push(maxPrice); }

  sql += ' ORDER BY l.created_at DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows.map(r => ({ ...toListingResponse(r), farmerName: r.farmer_name, platformPrice: r.platform_price ? parseFloat(r.platform_price) : null })));
});

// GET /api/market/listings/mine  — FARMER's own listings
router.get('/listings/mine', authenticate, authorize('FARMER'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT l.*, po.platform_price, po.reference_price, po.quality_premium, po.demand_premium, po.location_premium
     FROM crop_listings l
     LEFT JOIN price_offers po ON po.listing_id = l.id
     WHERE l.farmer_id = ?
     ORDER BY l.created_at DESC`,
    [req.user.id]
  );
  res.json(rows.map(toListingWithOffer));
});

// GET /api/market/listings/:id
router.get('/listings/:id', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT l.*, u.name AS farmer_name, u.phone AS farmer_phone,
            po.platform_price, po.reference_price, po.quality_premium, po.demand_premium, po.location_premium
     FROM crop_listings l
     JOIN users u ON u.id = l.farmer_id
     LEFT JOIN price_offers po ON po.listing_id = l.id
     WHERE l.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Listing not found' });
  const r = rows[0];
  res.json({
    ...toListingWithOffer(r),
    farmerName:  r.farmer_name,
    farmerPhone: r.farmer_phone,
  });
});

// GET /api/market/listings/:id/offer  — Platform Assured Price breakdown
router.get('/listings/:id/offer', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT po.*, l.farmer_id FROM price_offers po
     JOIN crop_listings l ON l.id = po.listing_id
     WHERE po.listing_id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Offer not found' });
  const po = rows[0];
  if (req.user.role !== 'ADMIN' && req.user.id !== po.farmer_id) {
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  }
  res.json(toOfferResponse(po));
});

// PATCH /api/market/listings/:id/verify  — ADMIN verifies a listing
router.patch('/listings/:id/verify', authenticate, authorize('ADMIN'), async (req, res) => {
  await pool.query('UPDATE crop_listings SET verified = 1 WHERE id = ?', [req.params.id]);
  res.json({ message: 'Listing verified' });
});

// ---- Purchase Requests ----

// POST /api/market/purchase-requests  — BUYER submits a request
router.post('/purchase-requests', authenticate, authorize('BUYER'), async (req, res) => {
  const { listingId, quantity, offeredPrice } = req.body;
  if (!listingId || !quantity) {
    return res.status(400).json({ status: 400, message: 'listingId and quantity are required' });
  }
  const [listings] = await pool.query("SELECT * FROM crop_listings WHERE id = ? AND status = 'AVAILABLE'", [listingId]);
  if (listings.length === 0) {
    return res.status(404).json({ status: 404, message: 'Listing not found or not available' });
  }
  const [result] = await pool.query(
    'INSERT INTO purchase_requests (buyer_id, listing_id, quantity, offered_price) VALUES (?, ?, ?, ?)',
    [req.user.id, listingId, quantity, offeredPrice || null]
  );
  const [rows] = await pool.query('SELECT * FROM purchase_requests WHERE id = ?', [result.insertId]);
  res.status(201).json(toPRResponse(rows[0]));
});

// GET /api/market/purchase-requests/mine  — BUYER sees their requests
router.get('/purchase-requests/mine', authenticate, authorize('BUYER'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT pr.*, l.crop_name, l.variety, l.quality, u.name AS farmer_name
     FROM purchase_requests pr
     JOIN crop_listings l ON l.id = pr.listing_id
     JOIN users u ON u.id = l.farmer_id
     WHERE pr.buyer_id = ?
     ORDER BY pr.created_at DESC`,
    [req.user.id]
  );
  res.json(rows.map(r => ({ ...toPRResponse(r), cropName: r.crop_name, variety: r.variety, quality: r.quality, farmerName: r.farmer_name })));
});

// GET /api/market/purchase-requests/received  — FARMER sees incoming requests on their listings
router.get('/purchase-requests/received', authenticate, authorize('FARMER'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT pr.*, l.crop_name, l.variety, l.quality, u.name AS buyer_name, u.phone AS buyer_phone
     FROM purchase_requests pr
     JOIN crop_listings l ON l.id = pr.listing_id
     JOIN users u ON u.id = pr.buyer_id
     WHERE l.farmer_id = ?
     ORDER BY pr.created_at DESC`,
    [req.user.id]
  );
  res.json(rows.map(r => ({ ...toPRResponse(r), cropName: r.crop_name, variety: r.variety, quality: r.quality, buyerName: r.buyer_name, buyerPhone: r.buyer_phone })));
});

// PATCH /api/market/purchase-requests/:id/status  — FARMER accepts or rejects
router.patch('/purchase-requests/:id/status', authenticate, authorize('FARMER'), async (req, res) => {
  const { status } = req.body;
  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ status: 400, message: 'status must be ACCEPTED or REJECTED' });
  }
  const [rows] = await pool.query(
    `SELECT pr.*, l.farmer_id FROM purchase_requests pr
     JOIN crop_listings l ON l.id = pr.listing_id
     WHERE pr.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Purchase request not found' });
  if (rows[0].farmer_id !== req.user.id) return res.status(403).json({ status: 403, message: 'Forbidden' });

  await pool.query('UPDATE purchase_requests SET status = ? WHERE id = ?', [status, req.params.id]);
  if (status === 'ACCEPTED') {
    await pool.query("UPDATE crop_listings SET status = 'RESERVED' WHERE id = ?", [rows[0].listing_id]);
  }
  const [updated] = await pool.query('SELECT * FROM purchase_requests WHERE id = ?', [req.params.id]);
  res.json(toPRResponse(updated[0]));
});

// ---- Reference Prices (admin) ----
router.get('/reference-prices', authenticate, authorize('ADMIN'), async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM reference_prices ORDER BY crop_name');
  res.json(rows);
});

router.put('/reference-prices/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  const { referencePrice, qualityAPremium, qualityBPremium, qualityCPremium, demandPremiumPct, locationPremium } = req.body;
  await pool.query(
    `UPDATE reference_prices SET
      reference_price=?, quality_a_premium=?, quality_b_premium=?, quality_c_premium=?,
      demand_premium_pct=?, location_premium=?
     WHERE id=?`,
    [referencePrice, qualityAPremium, qualityBPremium, qualityCPremium, demandPremiumPct, locationPremium, req.params.id]
  );
  res.json({ message: 'Reference price updated' });
});

// ---- Price calculation helper ----
async function calculateOffer(listingId, cropName, quality) {
  const [priceRows] = await pool.query('SELECT * FROM reference_prices WHERE crop_name = ?', [cropName]);
  if (priceRows.length === 0) {
    // No reference price configured — store zeros
    await pool.query(
      'INSERT INTO price_offers (listing_id, reference_price, quality_premium, demand_premium, location_premium, platform_price) VALUES (?,0,0,0,0,0)',
      [listingId]
    );
    return { referencePrice: 0, qualityPremium: 0, demandPremium: 0, locationPremium: 0, platformPrice: 0 };
  }
  const rp = priceRows[0];
  const refPrice = parseFloat(rp.reference_price);
  const qualPremium = quality === 'A' ? parseFloat(rp.quality_a_premium)
                    : quality === 'B' ? parseFloat(rp.quality_b_premium)
                    :                   parseFloat(rp.quality_c_premium);
  const demandPremium   = refPrice * (parseFloat(rp.demand_premium_pct) / 100);
  const locationPremium = parseFloat(rp.location_premium);
  const platformPrice   = refPrice + qualPremium + demandPremium + locationPremium;

  await pool.query(
    `INSERT INTO price_offers (listing_id, reference_price, quality_premium, demand_premium, location_premium, platform_price)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      reference_price=VALUES(reference_price), quality_premium=VALUES(quality_premium),
      demand_premium=VALUES(demand_premium), location_premium=VALUES(location_premium),
      platform_price=VALUES(platform_price)`,
    [listingId, refPrice, qualPremium, demandPremium.toFixed(2), locationPremium, platformPrice.toFixed(2)]
  );
  return { referencePrice: refPrice, qualityPremium: qualPremium, demandPremium: parseFloat(demandPremium.toFixed(2)), locationPremium, platformPrice: parseFloat(platformPrice.toFixed(2)) };
}

// ---- Response helpers ----
function toListingResponse(l) {
  return {
    id:            l.id,
    farmerId:      l.farmer_id,
    cropName:      l.crop_name,
    variety:       l.variety,
    quantity:      parseFloat(l.quantity),
    unit:          l.unit,
    harvestDate:   l.harvest_date,
    location:      l.location,
    district:      l.district,
    state:         l.state,
    quality:       l.quality,
    imageUrl:      l.image_url,
    expectedPrice: l.expected_price ? parseFloat(l.expected_price) : null,
    status:        l.status,
    verified:      !!l.verified,
    createdAt:     l.created_at,
  };
}

function toListingWithOffer(l) {
  return {
    ...toListingResponse(l),
    priceOffer: l.platform_price ? {
      referencePrice: parseFloat(l.reference_price),
      qualityPremium: parseFloat(l.quality_premium),
      demandPremium:  parseFloat(l.demand_premium),
      locationPremium:parseFloat(l.location_premium),
      platformPrice:  parseFloat(l.platform_price),
    } : null,
  };
}

function toOfferResponse(po) {
  return {
    id:             po.id,
    listingId:      po.listing_id,
    referencePrice: parseFloat(po.reference_price),
    qualityPremium: parseFloat(po.quality_premium),
    demandPremium:  parseFloat(po.demand_premium),
    locationPremium:parseFloat(po.location_premium),
    platformPrice:  parseFloat(po.platform_price),
    createdAt:      po.created_at,
  };
}

function toPRResponse(r) {
  return {
    id:           r.id,
    buyerId:      r.buyer_id,
    listingId:    r.listing_id,
    quantity:     parseFloat(r.quantity),
    offeredPrice: r.offered_price ? parseFloat(r.offered_price) : null,
    status:       r.status,
    createdAt:    r.created_at,
  };
}

module.exports = router;
