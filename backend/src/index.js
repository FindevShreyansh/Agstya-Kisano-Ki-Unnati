require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ---- Middleware ----
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Routes ----
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/farms',     require('./routes/farms'));
app.use('/api/soil',      require('./routes/soil'));
app.use('/api/market',    require('./routes/market'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ---- Health check ----
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ---- 404 ----
app.use((req, res) => res.status(404).json({ status: 404, message: `Route ${req.method} ${req.path} not found` }));

// ---- Global error handler ----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ status: err.status || 500, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🌱 AgriTech API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
