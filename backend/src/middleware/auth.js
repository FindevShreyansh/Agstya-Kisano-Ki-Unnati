const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer token and attaches req.user = { id, name, email, role }.
 * Returns 401 if missing or invalid.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: 401, message: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ status: 401, message: 'Invalid or expired token' });
  }
}

/**
 * Role guard — use after authenticate().
 * authorize('ADMIN', 'SOIL_EXPERT') → either role is allowed.
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
