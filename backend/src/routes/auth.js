const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../db/pool');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ status: 400, message: 'name, email, password and role are required' });
  }
  if (!['FARMER', 'BUYER'].includes(role)) {
    return res.status(400).json({ status: 400, message: 'Only FARMER or BUYER can self-register' });
  }

  const normalEmail = email.trim().toLowerCase();
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalEmail]);
  if (existing.length > 0) {
    return res.status(409).json({ status: 409, message: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), normalEmail, phone || null, hash, role]
  );

  const token = jwt.sign(
    { id: result.insertId, name: name.trim(), email: normalEmail, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  res.status(201).json({ token, userId: result.insertId, name: name.trim(), role });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 400, message: 'email and password are required' });
  }

  const normalEmail = email.trim().toLowerCase();
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [normalEmail]);
  if (rows.length === 0) {
    return res.status(401).json({ status: 401, message: 'Invalid email or password' });
  }

  const user = rows[0];
  const ok   = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ status: 401, message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  res.json({ token, userId: user.id, name: user.name, role: user.role });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ userId: req.user.id, email: req.user.email, name: req.user.name, role: req.user.role });
});

module.exports = router;
