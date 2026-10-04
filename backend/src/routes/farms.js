const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/farms  — FARMER creates a farm
router.post('/', authenticate, authorize('FARMER'), async (req, res) => {
  const { location, district, state, areaAcres } = req.body;
  if (!location || !district || !state || !areaAcres) {
    return res.status(400).json({ status: 400, message: 'location, district, state and areaAcres are required' });
  }
  const [result] = await pool.query(
    'INSERT INTO farms (farmer_id, location, district, state, area_acres) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, location, district, state, areaAcres]
  );
  const [rows] = await pool.query('SELECT * FROM farms WHERE id = ?', [result.insertId]);
  res.status(201).json(toResponse(rows[0]));
});

// GET /api/farms/mine  — FARMER lists own farms
router.get('/mine', authenticate, authorize('FARMER'), async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM farms WHERE farmer_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(rows.map(toResponse));
});

// GET /api/farms  — ADMIN lists all
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT f.*, u.name AS farmer_name FROM farms f
     JOIN users u ON u.id = f.farmer_id
     ORDER BY f.created_at DESC`
  );
  res.json(rows.map(r => ({ ...toResponse(r), farmerName: r.farmer_name })));
});

// GET /api/farms/:id
router.get('/:id', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM farms WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Farm not found' });
  const farm = rows[0];
  if (req.user.role !== 'ADMIN' && farm.farmer_id !== req.user.id) {
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  }
  res.json(toResponse(farm));
});

function toResponse(f) {
  return {
    id:         f.id,
    farmerId:   f.farmer_id,
    location:   f.location,
    district:   f.district,
    state:      f.state,
    areaAcres:  parseFloat(f.area_acres),
    createdAt:  f.created_at,
  };
}

module.exports = router;