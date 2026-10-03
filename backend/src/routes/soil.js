const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// Valid status transitions (state machine)
const TRANSITIONS = {
  PENDING:          'ASSIGNED',
  ASSIGNED:         'SCHEDULED',
  SCHEDULED:        'SAMPLE_COLLECTED',
  SAMPLE_COLLECTED: 'LAB_PROCESSING',
  LAB_PROCESSING:   'COMPLETED',
};

// POST /api/soil/requests  — FARMER creates a request
router.post('/requests', authenticate, authorize('FARMER'), async (req, res) => {
  const { farmId, preferredDate, preferredTime } = req.body;
  if (!farmId) {
    return res.status(400).json({ status: 400, message: 'farmId is required' });
  }
  // Verify the farm belongs to this farmer
  const [farms] = await pool.query('SELECT id FROM farms WHERE id = ? AND farmer_id = ?', [farmId, req.user.id]);
  if (farms.length === 0) {
    return res.status(404).json({ status: 404, message: 'Farm not found or does not belong to you' });
  }

  const [result] = await pool.query(
    `INSERT INTO soil_test_requests (farmer_id, farm_id, preferred_date, preferred_time)
     VALUES (?, ?, ?, ?)`,
    [req.user.id, farmId, preferredDate || null, preferredTime || null]
  );
  const [rows] = await pool.query('SELECT * FROM soil_test_requests WHERE id = ?', [result.insertId]);
  res.status(201).json(toResponse(rows[0]));
});

// GET /api/soil/requests/mine  — FARMER lists own requests
router.get('/requests/mine', authenticate, authorize('FARMER'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, f.location AS farm_location, f.district, f.state
     FROM soil_test_requests r
     JOIN farms f ON f.id = r.farm_id
     WHERE r.farmer_id = ?
     ORDER BY r.created_at DESC`,
    [req.user.id]
  );
  res.json(rows.map(toResponse));
});

// GET /api/soil/requests/assigned  — SOIL_EXPERT sees their assigned requests
router.get('/requests/assigned', authenticate, authorize('SOIL_EXPERT'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.name AS farmer_name, u.phone AS farmer_phone,
            f.location AS farm_location, f.district, f.state, f.area_acres
     FROM soil_test_requests r
     JOIN users u ON u.id = r.farmer_id
     JOIN farms f ON f.id = r.farm_id
     WHERE r.assigned_expert_id = ?
     ORDER BY r.scheduled_at ASC`,
    [req.user.id]
  );
  res.json(rows.map(r => ({
    ...toResponse(r),
    farmerName:    r.farmer_name,
    farmerPhone:   r.farmer_phone,
    farmLocation:  r.farm_location,
    farmDistrict:  r.district,
    farmState:     r.state,
    farmAreaAcres: parseFloat(r.area_acres),
  })));
});

// GET /api/soil/requests  — ADMIN: filter by status
router.get('/requests', authenticate, authorize('ADMIN'), async (req, res) => {
  const { status } = req.query;
  let sql = `SELECT r.*, u.name AS farmer_name, f.location AS farm_location, f.district, f.state
             FROM soil_test_requests r
             JOIN users u ON u.id = r.farmer_id
             JOIN farms f ON f.id = r.farm_id`;
  const params = [];
  if (status) { sql += ' WHERE r.status = ?'; params.push(status); }
  sql += ' ORDER BY r.created_at DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows.map(r => ({ ...toResponse(r), farmerName: r.farmer_name, farmLocation: r.farm_location })));
});

// GET /api/soil/requests/:id
router.get('/requests/:id', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.name AS farmer_name, f.location AS farm_location
     FROM soil_test_requests r
     JOIN users u ON u.id = r.farmer_id
     JOIN farms f ON f.id = r.farm_id
     WHERE r.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Request not found' });
  const r = rows[0];
  if (req.user.role !== 'ADMIN'
    && req.user.id !== r.farmer_id
    && req.user.id !== r.assigned_expert_id) {
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  }
  res.json({ ...toResponse(r), farmerName: r.farmer_name, farmLocation: r.farm_location });
});

// PATCH /api/soil/requests/:id/status  — advance the status machine
router.patch('/requests/:id/status', authenticate, async (req, res) => {
  const { status, expertId, scheduledAt } = req.body;
  const [rows] = await pool.query('SELECT * FROM soil_test_requests WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Request not found' });

  const request = rows[0];
  const expected = TRANSITIONS[request.status];

  if (expected !== status) {
    return res.status(400).json({
      status: 400,
      message: `Invalid transition. Current status is ${request.status}; next allowed is ${expected}`
    });
  }

  // Role checks
  if (status === 'ASSIGNED' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ status: 403, message: 'Only ADMIN can assign an expert' });
  }
  if (status === 'SAMPLE_COLLECTED'
    && req.user.role !== 'ADMIN'
    && req.user.id !== request.assigned_expert_id) {
    return res.status(403).json({ status: 403, message: 'Only the assigned expert or ADMIN can mark sample collected' });
  }

  const updates = { status };
  if (status === 'ASSIGNED' && expertId)   updates.assigned_expert_id = expertId;
  if (status === 'SCHEDULED' && scheduledAt) updates.scheduled_at = scheduledAt;

  const setClauses = Object.keys(updates).map(k => `${toColumn(k)} = ?`).join(', ');
  await pool.query(
    `UPDATE soil_test_requests SET ${setClauses} WHERE id = ?`,
    [...Object.values(updates), req.params.id]
  );

  const [updated] = await pool.query('SELECT * FROM soil_test_requests WHERE id = ?', [req.params.id]);
  res.json(toResponse(updated[0]));
});

// POST /api/soil/requests/:id/report  — ADMIN submits lab report → triggers recommendations
router.post('/requests/:id/report', authenticate, authorize('ADMIN'), async (req, res) => {
  const { sampleId, ph, nitrogen, phosphorus, potassium, organicCarbon, electricalConductivity, soilType } = req.body;
  const [rows] = await pool.query('SELECT * FROM soil_test_requests WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Request not found' });

  // Insert report
  const [rRes] = await pool.query(
    `INSERT INTO soil_reports
      (request_id, sample_id, ph, nitrogen, phosphorus, potassium, organic_carbon, electrical_conductivity, soil_type, verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
      sample_id=VALUES(sample_id), ph=VALUES(ph), nitrogen=VALUES(nitrogen),
      phosphorus=VALUES(phosphorus), potassium=VALUES(potassium),
      organic_carbon=VALUES(organic_carbon), electrical_conductivity=VALUES(electrical_conductivity),
      soil_type=VALUES(soil_type), verified=1`,
    [req.params.id, sampleId || null, ph, nitrogen, phosphorus, potassium, organicCarbon, electricalConductivity, soilType || null]
  );

  // Get the report id (insertId works for insert; for update, fetch it)
  const [repRows] = await pool.query('SELECT id FROM soil_reports WHERE request_id = ?', [req.params.id]);
  const reportId  = repRows[0].id;

  // Mark request COMPLETED
  await pool.query('UPDATE soil_test_requests SET status = ? WHERE id = ?', ['COMPLETED', req.params.id]);

  // Generate crop recommendations
  await generateRecommendations(reportId, req.params.id, { ph, nitrogen, phosphorus, potassium, organicCarbon });

  res.status(201).json({ message: 'Report submitted and recommendations generated', reportId });
});

// GET /api/soil/requests/:id/report
router.get('/requests/:id/report', authenticate, async (req, res) => {
  const [reqRows] = await pool.query('SELECT * FROM soil_test_requests WHERE id = ?', [req.params.id]);
  if (reqRows.length === 0) return res.status(404).json({ status: 404, message: 'Request not found' });
  if (req.user.role !== 'ADMIN' && req.user.id !== reqRows[0].farmer_id) {
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  }
  const [repRows] = await pool.query('SELECT * FROM soil_reports WHERE request_id = ?', [req.params.id]);
  if (repRows.length === 0) return res.status(404).json({ status: 404, message: 'Report not yet available' });
  res.json(toReportResponse(repRows[0]));
});

// ---- Crop Recommendations ----

// GET /api/soil/recommendations?requestId=
router.get('/recommendations', authenticate, async (req, res) => {
  const { requestId } = req.query;
  if (!requestId) return res.status(400).json({ status: 400, message: 'requestId is required' });

  const [reqRows] = await pool.query('SELECT * FROM soil_test_requests WHERE id = ?', [requestId]);
  if (reqRows.length === 0) return res.status(404).json({ status: 404, message: 'Request not found' });
  if (req.user.role !== 'ADMIN' && req.user.id !== reqRows[0].farmer_id) {
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  }

  const [rows] = await pool.query(
    'SELECT * FROM crop_recommendations WHERE request_id = ? ORDER BY score DESC',
    [requestId]
  );
  res.json(rows);
});

// ---- Helper: Rule-based recommendation engine ----
async function generateRecommendations(reportId, requestId, soilValues) {
  const { ph, nitrogen, phosphorus, potassium, organicCarbon } = soilValues;
  const [profiles] = await pool.query('SELECT * FROM crop_profiles');

  // Delete old recommendations for this report
  await pool.query('DELETE FROM crop_recommendations WHERE report_id = ?', [reportId]);

  const recs = profiles.map(crop => {
    const scores = [
      paramScore(ph,           crop.ph_min,  crop.ph_max,  'pH'),
      paramScore(nitrogen,     crop.n_min,   crop.n_max,   'Nitrogen'),
      paramScore(phosphorus,   crop.p_min,   crop.p_max,   'Phosphorus'),
      paramScore(potassium,    crop.k_min,   crop.k_max,   'Potassium'),
      paramScore(organicCarbon,crop.oc_min,  crop.oc_max,  'Organic Carbon'),
    ];

    // Weighted average: pH 25%, N 25%, P 20%, K 20%, OC 10%
    const weights = [0.25, 0.25, 0.20, 0.20, 0.10];
    const score = scores.reduce((sum, s, i) => sum + s.score * weights[i], 0);

    const suitability = score >= 0.75 ? 'HIGH' : score >= 0.5 ? 'MEDIUM' : 'LOW';
    const reasons = scores
      .filter(s => s.note)
      .map(s => s.note)
      .join(' ');

    return { cropName: crop.crop_name, suitability, score: score.toFixed(4), reason: reasons || 'All parameters within acceptable range.', season: crop.season };
  });

  // Insert all recommendations
  for (const r of recs) {
    await pool.query(
      `INSERT INTO crop_recommendations (report_id, request_id, crop_name, suitability, score, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [reportId, requestId, r.cropName, r.suitability, r.score, r.reason]
    );
  }
}

function paramScore(value, min, max, label) {
  const v   = parseFloat(value);
  const mn  = parseFloat(min);
  const mx  = parseFloat(max);
  const range = mx - mn;

  if (v >= mn && v <= mx) {
    return { score: 1.0, note: null };
  }
  if (v < mn) {
    const deficit = mn - v;
    const score   = Math.max(0, 1 - deficit / (range || 1));
    return { score, note: `${label} (${v}) is below the ideal range ${mn}–${mx}; consider supplementation.` };
  }
  // v > mx
  const excess = v - mx;
  const score  = Math.max(0, 1 - excess / (range || 1));
  return { score, note: `${label} (${v}) is above the ideal range ${mn}–${mx}; manage application carefully.` };
}

// ---- Helpers ----
function toResponse(r) {
  return {
    id:               r.id,
    farmerId:         r.farmer_id,
    farmId:           r.farm_id,
    preferredDate:    r.preferred_date,
    preferredTime:    r.preferred_time,
    status:           r.status,
    assignedExpertId: r.assigned_expert_id,
    scheduledAt:      r.scheduled_at,
    createdAt:        r.created_at,
  };
}

function toReportResponse(r) {
  return {
    id:                     r.id,
    requestId:              r.request_id,
    sampleId:               r.sample_id,
    ph:                     parseFloat(r.ph),
    nitrogen:               parseFloat(r.nitrogen),
    phosphorus:             parseFloat(r.phosphorus),
    potassium:              parseFloat(r.potassium),
    organicCarbon:          parseFloat(r.organic_carbon),
    electricalConductivity: parseFloat(r.electrical_conductivity),
    soilType:               r.soil_type,
    reportFileUrl:          r.report_file_url,
    verified:               !!r.verified,
    createdAt:              r.created_at,
  };
}

function toColumn(key) {
  const map = {
    status: 'status',
    assigned_expert_id: 'assigned_expert_id',
    scheduled_at: 'scheduled_at',
  };
  return map[key] || key;
}

module.exports = router;
