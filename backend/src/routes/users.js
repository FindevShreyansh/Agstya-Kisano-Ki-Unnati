const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/users/experts  — ADMIN gets expert list for the assign dropdown
router.get('/experts', authenticate, authorize('ADMIN'), async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone FROM users WHERE role = 'SOIL_EXPERT' ORDER BY name"
  );
  res.json(rows);
});

// GET /api/users  — ADMIN: all users
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
  );
  res.json(rows);
});

module.exports = router;
