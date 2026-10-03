const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/dashboard/farmer  — full farmer dashboard aggregate
router.get('/farmer', authenticate, authorize('FARMER'), async (req, res) => {
  const farmerId = req.user.id;

  const [[farms], [soilRequests], [listings], [purchaseRequests]] = await Promise.all([
    pool.query('SELECT * FROM farms WHERE farmer_id = ? ORDER BY created_at DESC', [farmerId]),
    pool.query(
      `SELECT r.*, f.location AS farm_location, f.district, f.state
       FROM soil_test_requests r
       JOIN farms f ON f.id = r.farm_id
       WHERE r.farmer_id = ?
       ORDER BY r.created_at DESC`,
      [farmerId]
    ),
    pool.query(
      `SELECT l.*, po.platform_price, po.reference_price, po.quality_premium, po.demand_premium, po.location_premium
       FROM crop_listings l
       LEFT JOIN price_offers po ON po.listing_id = l.id
       WHERE l.farmer_id = ?
       ORDER BY l.created_at DESC`,
      [farmerId]
    ),
    pool.query(
      `SELECT pr.*, l.crop_name, l.variety, u.name AS buyer_name
       FROM purchase_requests pr
       JOIN crop_listings l ON l.id = pr.listing_id
       JOIN users u ON u.id = pr.buyer_id
       WHERE l.farmer_id = ?
       ORDER BY pr.created_at DESC`,
      [farmerId]
    ),
  ]);

  // Fetch soil reports and recommendations for completed requests
  const completedRequests = soilRequests.filter(r => r.status === 'COMPLETED');
  const reportsAndRecs = await Promise.all(completedRequests.map(async (req) => {
    const [[report]] = await Promise.all([
      pool.query('SELECT * FROM soil_reports WHERE request_id = ?', [req.id]),
    ]);
    const [recs] = await pool.query(
      'SELECT * FROM crop_recommendations WHERE request_id = ? ORDER BY score DESC',
      [req.id]
    );
    return { requestId: req.id, report: report[0] || null, recommendations: recs };
  }));

  res.json({
    farmer: { id: farmerId, name: req.user.name, email: req.user.email },
    farms,
    soilRequests,
    soilReports: reportsAndRecs,
    listings,
    purchaseRequestsReceived: purchaseRequests,
  });
});

// GET /api/dashboard/admin  — counts + recent activity
router.get('/admin', authenticate, authorize('ADMIN'), async (req, res) => {
  const [
    [farmers], [buyers], [experts],
    [totalSoilTests], [completedTests],
    [listings], [purchaseRequests],
    [recentRequests], [recentListings],
  ] = await Promise.all([
    pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'FARMER'"),
    pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'BUYER'"),
    pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'SOIL_EXPERT'"),
    pool.query('SELECT COUNT(*) AS count FROM soil_test_requests'),
    pool.query("SELECT COUNT(*) AS count FROM soil_test_requests WHERE status = 'COMPLETED'"),
    pool.query('SELECT COUNT(*) AS count FROM crop_listings'),
    pool.query('SELECT COUNT(*) AS count FROM purchase_requests'),
    pool.query(
      `SELECT r.*, u.name AS farmer_name, f.district
       FROM soil_test_requests r
       JOIN users u ON u.id = r.farmer_id
       JOIN farms f ON f.id = r.farm_id
       ORDER BY r.created_at DESC LIMIT 10`
    ),
    pool.query(
      `SELECT l.*, u.name AS farmer_name
       FROM crop_listings l
       JOIN users u ON u.id = l.farmer_id
       ORDER BY l.created_at DESC LIMIT 10`
    ),
  ]);

  res.json({
    stats: {
      farmers:        farmers[0].count,
      buyers:         buyers[0].count,
      soilExperts:    experts[0].count,
      totalSoilTests: totalSoilTests[0].count,
      completedTests: completedTests[0].count,
      listings:       listings[0].count,
      purchaseRequests: purchaseRequests[0].count,
    },
    recentSoilRequests: recentRequests,
    recentListings,
  });
});

module.exports = router;
