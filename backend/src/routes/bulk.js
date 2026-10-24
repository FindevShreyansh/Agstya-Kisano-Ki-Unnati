const router = require('express').Router();
const pool = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');
const { normalizeQuantity, qualityMatches, estimateDistanceKm, buildPlans } = require('../services/bulkEngine');
const { calculateTrustScore, trustBand, trustExplanation } = require('../services/trust');

router.get('/places', authenticate, async (req, res) => {
  const search = String(req.query.q || '').trim();
  const params = [];
  let sql = 'SELECT id, state, district, city, aliases FROM place_catalog';
  if (search) {
    sql += ' WHERE state LIKE ? OR district LIKE ? OR city LIKE ? OR aliases LIKE ?';
    const value = `%${search}%`;
    params.push(value, value, value, value);
  }
  sql += ' ORDER BY state, district, city LIMIT 100';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.get('/trust/:farmerId', authenticate, async (req, res) => {
  res.json(await getTrust(Number(req.params.farmerId)));
});

router.post('/requirements/plan', authenticate, authorize('BUYER'), async (req, res) => {
  const {
    cropName, variety, quantity, unit, minimumQuality, deliveryState,
    deliveryDistrict, deliveryCity, deliveryDate, maxBudget, maxFarmers = 6,
    partialFulfillment = false,
  } = req.body;
  if (!cropName || !quantity || !minimumQuality || !deliveryState || !deliveryDistrict || !deliveryCity || !deliveryDate) {
    return res.status(400).json({ status: 400, message: 'cropName, quantity, minimumQuality, delivery location and deliveryDate are required' });
  }
  if (!['A', 'B', 'C'].includes(minimumQuality) || maxFarmers < 1 || maxFarmers > 10) {
    return res.status(400).json({ status: 400, message: 'minimumQuality must be A, B or C and maxFarmers must be between 1 and 10' });
  }

  const quantityKg = normalizeQuantity(quantity, unit);
  const [rows] = await pool.query(
    `SELECT l.id AS listing_id, l.farmer_id, l.quantity, l.available_quantity,
            l.quality, l.crop_name, l.variety, l.location, l.district, l.state,
            COALESCE(l.available_quantity, l.quantity) AS available_quantity_kg,
            COALESCE(po.platform_price, l.expected_price, 0) AS unit_price,
            u.name AS farmer_name
     FROM crop_listings l
     JOIN users u ON u.id = l.farmer_id
     LEFT JOIN price_offers po ON po.listing_id = l.id
     WHERE l.status IN ('AVAILABLE','RESERVED') AND l.crop_name = ?`,
    [cropName]
  );

  const candidates = [];
  for (const row of rows) {
    if (!qualityMatches(row.quality, minimumQuality)) continue;
    if (variety && row.variety && row.variety.toLowerCase() !== variety.toLowerCase()) continue;
    const trust = await getTrust(row.farmer_id);
    candidates.push({
      listingId: row.listing_id,
      farmerId: row.farmer_id,
      farmerName: row.farmer_name,
      availableQuantityKg: row.available_quantity_kg,
      unitPrice: row.unit_price,
      distanceKm: estimateDistanceKm(
        { state: row.state, district: row.district, city: row.location },
        { state: deliveryState, district: deliveryDistrict, city: deliveryCity }
      ),
      trustScore: trust.score,
      trustBand: trust.band,
    });
  }

  const plans = buildPlans({
    listings: candidates,
    quantityKg,
    maxFarmers: Number(maxFarmers),
    maxBudget: maxBudget == null || maxBudget === '' ? null : Number(maxBudget),
    partialFulfillment: Boolean(partialFulfillment),
  });
  if (plans.length === 0) {
    return res.status(422).json({ status: 422, message: 'No feasible procurement plan satisfies the requested quantity and constraints' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [requirementResult] = await connection.query(
      `INSERT INTO bulk_requirements
       (buyer_id, crop_name, variety, quantity_kg, minimum_quality, delivery_state, delivery_district,
        delivery_city, delivery_date, max_budget, max_farmers, partial_fulfillment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PLANNED')`,
      [req.user.id, cropName, variety || null, quantityKg, minimumQuality, deliveryState,
        deliveryDistrict, deliveryCity, deliveryDate, maxBudget || null, maxFarmers, partialFulfillment ? 1 : 0]
    );
    const requirementId = requirementResult.insertId;
    for (const plan of plans) {
      const [planResult] = await connection.query(
        `INSERT INTO bulk_plans
         (requirement_id, plan_type, requested_quantity_kg, allocated_quantity_kg, remaining_quantity_kg,
          farmer_count, produce_subtotal, logistics_estimate, total_cost, score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [requirementId, plan.planType, plan.requestedQuantityKg, plan.allocatedQuantityKg, plan.remainingQuantityKg,
          plan.farmerCount, plan.produceSubtotal, plan.logisticsEstimate, plan.totalCost, plan.score]
      );
      for (const allocation of plan.allocations) {
        await connection.query(
          `INSERT INTO bulk_allocations
           (plan_id, listing_id, farmer_id, quantity_kg, unit_price, subtotal, distance_km)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [planResult.insertId, allocation.listingId, allocation.farmerId, allocation.quantityKg,
            allocation.unitPrice, allocation.subtotal, allocation.distanceKm]
        );
      }
      plan.id = planResult.insertId;
    }
    await connection.commit();
    res.status(201).json({ requirementId, quantityKg, plans });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

router.get('/requirements/mine', authenticate, authorize('BUYER'), async (req, res) => {
  const [requirements] = await pool.query(
    'SELECT * FROM bulk_requirements WHERE buyer_id = ? ORDER BY created_at DESC',
    [req.user.id]
  );
  for (const requirement of requirements) {
    const [plans] = await pool.query(
      'SELECT * FROM bulk_plans WHERE requirement_id = ? ORDER BY score',
      [requirement.id]
    );
    for (const plan of plans) {
      const [allocations] = await pool.query(
        `SELECT ba.*, u.name AS farmer_name, l.crop_name, l.quality
         FROM bulk_allocations ba
         JOIN users u ON u.id = ba.farmer_id
         JOIN crop_listings l ON l.id = ba.listing_id
         WHERE ba.plan_id = ?`,
        [plan.id]
      );
      plan.allocations = allocations;
    }
    requirement.plans = plans;
  }
  res.json(requirements);
});

router.post('/requirements/:id/confirm', authenticate, authorize('BUYER'), async (req, res) => {
  const { planId } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[requirement]] = await connection.query(
      'SELECT * FROM bulk_requirements WHERE id = ? AND buyer_id = ? FOR UPDATE',
      [req.params.id, req.user.id]
    );
    const [[plan]] = await connection.query(
      'SELECT * FROM bulk_plans WHERE id = ? AND requirement_id = ? FOR UPDATE',
      [planId, req.params.id]
    );
    if (!requirement || !plan) {
      await connection.rollback();
      return res.status(404).json({ status: 404, message: 'Requirement or plan not found' });
    }
    await connection.query('UPDATE bulk_plans SET selected = 0 WHERE requirement_id = ?', [req.params.id]);
    await connection.query('UPDATE bulk_plans SET selected = 1 WHERE id = ?', [planId]);
    await connection.query("UPDATE bulk_requirements SET status = 'CONFIRMED' WHERE id = ?", [req.params.id]);
    await connection.commit();
    res.json({ message: 'Plan confirmed. Farmer requests are now pending acceptance.', requirementId: Number(req.params.id), planId: Number(planId) });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

router.get('/allocations/received', authenticate, authorize('FARMER'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ba.*, bp.requirement_id, br.crop_name, br.delivery_city, br.delivery_date,
            u.name AS buyer_name, l.quality
     FROM bulk_allocations ba
     JOIN bulk_plans bp ON bp.id = ba.plan_id AND bp.selected = 1
     JOIN bulk_requirements br ON br.id = bp.requirement_id
     JOIN users u ON u.id = br.buyer_id
     JOIN crop_listings l ON l.id = ba.listing_id
     WHERE ba.farmer_id = ?
     ORDER BY ba.created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

router.patch('/allocations/:id/status', authenticate, authorize('FARMER'), async (req, res) => {
  const { status } = req.body;
  if (!['ACCEPTED', 'REJECTED'].includes(status)) return res.status(400).json({ status: 400, message: 'status must be ACCEPTED or REJECTED' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[allocation]] = await connection.query(
      `SELECT ba.*, br.buyer_id, l.available_quantity, l.quantity
       FROM bulk_allocations ba
       JOIN bulk_plans bp ON bp.id = ba.plan_id AND bp.selected = 1
       JOIN bulk_requirements br ON br.id = bp.requirement_id
       JOIN crop_listings l ON l.id = ba.listing_id
       WHERE ba.id = ? AND ba.farmer_id = ? FOR UPDATE`,
      [req.params.id, req.user.id]
    );
    if (!allocation) {
      await connection.rollback();
      return res.status(404).json({ status: 404, message: 'Allocation not found' });
    }
    if (allocation.status !== 'PENDING') {
      await connection.rollback();
      return res.status(409).json({ status: 409, message: 'This allocation has already been processed' });
    }
    if (status === 'ACCEPTED') {
      const available = Number(allocation.available_quantity ?? allocation.quantity);
      if (available < Number(allocation.quantity_kg)) {
        await connection.rollback();
        return res.status(409).json({ status: 409, message: 'This listing no longer has enough available quantity' });
      }
      const remaining = available - Number(allocation.quantity_kg);
      await connection.query(
        `UPDATE crop_listings SET available_quantity = ?, status = ? WHERE id = ?`,
        [remaining, remaining === 0 ? 'RESERVED' : 'AVAILABLE', allocation.listing_id]
      );
      await connection.query(
        `INSERT INTO procurement_orders (buyer_id, farmer_id, listing_id, allocation_id, quantity_kg, status)
         VALUES (?, ?, ?, ?, ?, 'CONFIRMED')`,
        [allocation.buyer_id, req.user.id, allocation.listing_id, allocation.id, allocation.quantity_kg]
      );
    }
    await connection.query('UPDATE bulk_allocations SET status = ? WHERE id = ?', [status, req.params.id]);
    await connection.commit();
    res.json({ id: Number(req.params.id), status });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

router.patch('/orders/:id/status', authenticate, async (req, res) => {
  const { status, cancellationActor } = req.body;
  if (!['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'].includes(status)) return res.status(400).json({ status: 400, message: 'Invalid order status' });
  const [rows] = await pool.query('SELECT * FROM procurement_orders WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ status: 404, message: 'Order not found' });
  const order = rows[0];
  const allowed = req.user.role === 'ADMIN' || req.user.id === order.farmer_id || req.user.id === order.buyer_id;
  if (!allowed) return res.status(403).json({ status: 403, message: 'Forbidden' });
  await pool.query(
    'UPDATE procurement_orders SET status = ?, cancellation_actor = ? WHERE id = ?',
    [status, status === 'CANCELLED' ? cancellationActor || req.user.role : null, req.params.id]
  );
  await pool.query(
    'INSERT INTO procurement_order_events (order_id, event_type, actor_role, notes) VALUES (?, ?, ?, ?)',
    [req.params.id, status, req.user.role, null]
  );
  res.json({ id: Number(req.params.id), status });
});

router.get('/orders/disputes', authenticate, authorize('ADMIN'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT po.*, buyer.name AS buyer_name, farmer.name AS farmer_name, l.crop_name
     FROM procurement_orders po
     JOIN users buyer ON buyer.id = po.buyer_id
     JOIN users farmer ON farmer.id = po.farmer_id
     JOIN crop_listings l ON l.id = po.listing_id
     WHERE po.status = 'DISPUTED'
     ORDER BY po.updated_at DESC`
  );
  res.json(rows);
});

router.patch('/orders/:id/resolve', authenticate, authorize('ADMIN'), async (req, res) => {
  const { outcome, notes } = req.body;
  if (!['BUYER_FAVOR', 'FARMER_FAVOR', 'DISMISSED'].includes(outcome)) return res.status(400).json({ status: 400, message: 'Invalid dispute outcome' });
  const [result] = await pool.query(
    "UPDATE procurement_orders SET status = 'RESOLVED', dispute_outcome = ? WHERE id = ? AND status = 'DISPUTED'",
    [outcome, req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ status: 404, message: 'Open disputed order not found' });
  await pool.query(
    'INSERT INTO procurement_order_events (order_id, event_type, actor_role, notes) VALUES (?, "RESOLVED", "ADMIN", ?)',
    [req.params.id, notes || null]
  );
  res.json({ id: Number(req.params.id), status: 'RESOLVED', outcome });
});

async function getTrust(farmerId) {
  const [[row]] = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN status = 'COMPLETED' OR (status = 'RESOLVED' AND dispute_outcome = 'FARMER_FAVOR') THEN 1 ELSE 0 END), 0) AS positive_events,
       COALESCE(SUM(CASE WHEN (status = 'CANCELLED' AND cancellation_actor = 'FARMER')
                              OR (status = 'RESOLVED' AND dispute_outcome = 'BUYER_FAVOR') THEN 1 ELSE 0 END), 0) AS negative_events
     FROM procurement_orders WHERE farmer_id = ?`,
    [farmerId]
  );
  const score = calculateTrustScore({ positiveEvents: row.positive_events, negativeEvents: row.negative_events });
  return trustExplanation({ positiveEvents: row.positive_events, negativeEvents: row.negative_events, score });
}

module.exports = router;
