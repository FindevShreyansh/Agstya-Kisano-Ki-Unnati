const crypto = require('crypto');
const router = require('express').Router();
const pool = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

const categories = new Set(['SOIL', 'CROP_PLANNING', 'LISTINGS', 'BUYER_ENQUIRIES', 'PURCHASE_REQUESTS', 'ACCOUNT', 'OTHER']);
const priorities = new Set(['LOW', 'NORMAL', 'HIGH', 'URGENT']);
const statuses = new Set(['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED']);
const transitions = {
  OPEN: new Set(['IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  IN_PROGRESS: new Set(['OPEN', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED']),
  WAITING_FOR_USER: new Set(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  RESOLVED: new Set(['OPEN', 'IN_PROGRESS', 'CLOSED']),
  CLOSED: new Set(['OPEN']),
};

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function validId(value) {
  return /^\d+$/.test(String(value || ''));
}

async function getOwnedConversation(connection, id, user) {
  const [[conversation]] = await connection.query(
    'SELECT * FROM support_conversations WHERE id = ? AND owner_user_id = ? AND owner_role = ? FOR UPDATE',
    [id, user.id, user.role]
  );
  return conversation;
}

router.use(authenticate);

// User support inbox. Ownership and role always come from the verified token.
router.get('/conversations', authorize('FARMER', 'BUYER'), asyncRoute(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, t.ticket_code, t.status AS ticket_status, t.priority,
       (SELECT body FROM support_messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS latest_message,
       EXISTS (SELECT 1 FROM support_messages m WHERE m.conversation_id = c.id AND m.sender_type = 'ADMIN' AND m.created_at > COALESCE(c.last_user_read_at, '1970-01-01')) AS unread_admin_reply
     FROM support_conversations c
     LEFT JOIN support_tickets t ON t.conversation_id = c.id
     WHERE c.owner_user_id = ? AND c.owner_role = ?
     ORDER BY c.updated_at DESC`,
    [req.user.id, req.user.role]
  );
  res.json(rows);
}));

router.post('/conversations', authorize('FARMER', 'BUYER'), asyncRoute(async (req, res) => {
  const subject = typeof req.body.subject === 'string' ? req.body.subject.trim().slice(0, 180) : '';
  const category = categories.has(req.body.category) ? req.body.category : 'OTHER';
  if (subject.length < 3) return res.status(400).json({ message: 'Please enter a short description of the issue.' });
  const [result] = await pool.query(
    'INSERT INTO support_conversations (owner_user_id, owner_role, category, subject) VALUES (?, ?, ?, ?)',
    [req.user.id, req.user.role, category, subject]
  );
  res.status(201).json({ id: result.insertId, subject, category, state: 'UNESCALATED', aiAvailable: false });
}));

router.get('/conversations/:id', authorize('FARMER', 'BUYER'), asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid conversation ID.' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[conversation]] = await connection.query(
      `SELECT c.*, t.id AS ticket_id, t.ticket_code, t.summary, t.summary_is_ai, t.escalation_reason,
        t.priority, t.status AS ticket_status, t.assigned_admin_id
       FROM support_conversations c LEFT JOIN support_tickets t ON t.conversation_id = c.id
       WHERE c.id = ? AND c.owner_user_id = ? AND c.owner_role = ? FOR UPDATE`,
      [req.params.id, req.user.id, req.user.role]
    );
    if (!conversation) {
      await connection.rollback();
      return res.status(404).json({ message: 'Support conversation not found.' });
    }
    await connection.query('UPDATE support_conversations SET last_user_read_at = NOW() WHERE id = ?', [conversation.id]);
    const [messages] = await connection.query(
      'SELECT id, sender_type, sender_user_id, body, created_at FROM support_messages WHERE conversation_id = ? ORDER BY id ASC',
      [conversation.id]
    );
    await connection.commit();
    res.json({ conversation, messages, aiAvailable: false });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

router.post('/conversations/:id/messages', authorize('FARMER', 'BUYER'), asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid conversation ID.' });
  const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';
  const clientMessageId = typeof req.body.clientMessageId === 'string' && /^[\w-]{8,80}$/.test(req.body.clientMessageId)
    ? req.body.clientMessageId
    : null;
  if (!body || body.length > 4000) return res.status(400).json({ message: 'Message must contain 1 to 4000 characters.' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const conversation = await getOwnedConversation(connection, req.params.id, req.user);
    if (!conversation) {
      await connection.rollback();
      return res.status(404).json({ message: 'Support conversation not found.' });
    }
    if (clientMessageId) {
      const [[duplicate]] = await connection.query(
        'SELECT id FROM support_messages WHERE conversation_id = ? AND client_message_id = ?',
        [conversation.id, clientMessageId]
      );
      if (duplicate) {
        await connection.commit();
        return res.json({ duplicate: true, aiAvailable: false });
      }
    }
    await connection.query(
      'INSERT INTO support_messages (conversation_id, sender_type, sender_user_id, body, client_message_id) VALUES (?, \'USER\', ?, ?, ?)',
      [conversation.id, req.user.id, body, clientMessageId]
    );
    if (conversation.state === 'ESCALATED') {
      await connection.query(
        `UPDATE support_tickets SET status = CASE WHEN status IN ('WAITING_FOR_USER','RESOLVED','CLOSED') THEN 'IN_PROGRESS' ELSE status END,
         updated_at = NOW() WHERE conversation_id = ?`,
        [conversation.id]
      );
    }
    await connection.query('UPDATE support_conversations SET updated_at = NOW() WHERE id = ?', [conversation.id]);
    await connection.commit();
    res.status(201).json({
      saved: true,
      aiAvailable: false,
      mode: conversation.state,
      message: conversation.state === 'UNESCALATED'
        ? 'AI support is not configured yet. Your message is saved; you can escalate this conversation to the admin team.'
        : 'Your message is saved in this ticket. The support team can reply in this same conversation.',
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

router.post('/conversations/:id/escalate', authorize('FARMER', 'BUYER'), asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid conversation ID.' });
  const reason = typeof req.body.reason === 'string' && req.body.reason.trim()
    ? req.body.reason.trim().slice(0, 255)
    : 'The user requested human support.';
  const priority = priorities.has(req.body.priority) ? req.body.priority : 'NORMAL';
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const conversation = await getOwnedConversation(connection, req.params.id, req.user);
    if (!conversation) {
      await connection.rollback();
      return res.status(404).json({ message: 'Support conversation not found.' });
    }
    const [[existing]] = await connection.query('SELECT * FROM support_tickets WHERE conversation_id = ?', [conversation.id]);
    if (existing) {
      await connection.commit();
      return res.json(existing);
    }
    const code = `AGT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const [result] = await connection.query(
      `INSERT INTO support_tickets (ticket_code, conversation_id, escalation_reason, priority, status)
       VALUES (?, ?, ?, ?, 'OPEN')`,
      [code, conversation.id, reason, priority]
    );
    await connection.query("UPDATE support_conversations SET state = 'ESCALATED', updated_at = NOW() WHERE id = ?", [conversation.id]);
    await connection.commit();
    res.status(201).json({ id: result.insertId, ticket_code: code, conversation_id: conversation.id, status: 'OPEN', priority, escalation_reason: reason, summary: null, summary_is_ai: false });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

// Admin-only support centre data.
router.get('/tickets/overview', authorize('ADMIN'), asyncRoute(async (_req, res) => {
  const [[counts]] = await pool.query(
    `SELECT COUNT(*) AS total,
       SUM(status = 'OPEN') AS open,
       SUM(status = 'IN_PROGRESS') AS inProgress,
       SUM(status = 'RESOLVED') AS resolved,
       SUM(status NOT IN ('RESOLVED','CLOSED') AND
         (SELECT m.sender_type FROM support_messages m WHERE m.conversation_id = t.conversation_id ORDER BY m.id DESC LIMIT 1) = 'USER') AS awaitingAdmin
     FROM support_tickets t`
  );
  res.json(Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number(value || 0)])));
}));

router.get('/tickets', authorize('ADMIN'), asyncRoute(async (req, res) => {
  const where = [];
  const params = [];
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
  if (search) {
    where.push('(t.ticket_code LIKE ? OR u.name LIKE ? OR u.email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (['FARMER', 'BUYER'].includes(req.query.role)) { where.push('c.owner_role = ?'); params.push(req.query.role); }
  if (categories.has(req.query.category)) { where.push('c.category = ?'); params.push(req.query.category); }
  if (priorities.has(req.query.priority)) { where.push('t.priority = ?'); params.push(req.query.priority); }
  if (statuses.has(req.query.status)) { where.push('t.status = ?'); params.push(req.query.status); }
  const orderBy = req.query.sort === 'oldest'
    ? 't.created_at ASC'
    : req.query.sort === 'priority'
      ? "FIELD(t.priority, 'URGENT','HIGH','NORMAL','LOW') ASC, t.updated_at DESC"
      : 't.created_at DESC';
  const [rows] = await pool.query(
    `SELECT t.id, t.ticket_code, t.conversation_id, t.escalation_reason, t.priority, t.status, t.assigned_admin_id,
       t.created_at, t.updated_at, c.owner_role, c.category, c.subject, u.name AS user_name, u.email AS user_email,
       (SELECT body FROM support_messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS latest_message,
       ((SELECT sender_type FROM support_messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) = 'USER') AS awaiting_admin
     FROM support_tickets t JOIN support_conversations c ON c.id = t.conversation_id
     JOIN users u ON u.id = c.owner_user_id
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY ${orderBy} LIMIT 200`,
    params
  );
  res.json(rows);
}));

router.get('/tickets/:id', authorize('ADMIN'), asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID.' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[ticket]] = await connection.query(
      `SELECT t.*, c.owner_user_id, c.owner_role, c.category, c.subject, u.name AS user_name, u.email AS user_email, u.phone AS user_phone,
       a.name AS assigned_admin_name
       FROM support_tickets t JOIN support_conversations c ON c.id = t.conversation_id
       JOIN users u ON u.id = c.owner_user_id LEFT JOIN users a ON a.id = t.assigned_admin_id
       WHERE t.id = ? FOR UPDATE`,
      [req.params.id]
    );
    if (!ticket) {
      await connection.rollback();
      return res.status(404).json({ message: 'Support ticket not found.' });
    }
    await connection.query('UPDATE support_conversations SET last_admin_read_at = NOW() WHERE id = ?', [ticket.conversation_id]);
    const [messages] = await connection.query(
      'SELECT id, sender_type, sender_user_id, body, created_at FROM support_messages WHERE conversation_id = ? ORDER BY id ASC',
      [ticket.conversation_id]
    );
    await connection.commit();
    res.json({ ticket, messages });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

router.post('/tickets/:id/messages', authorize('ADMIN'), asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID.' });
  const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';
  if (!body || body.length > 4000) return res.status(400).json({ message: 'Reply must contain 1 to 4000 characters.' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[ticket]] = await connection.query('SELECT * FROM support_tickets WHERE id = ? FOR UPDATE', [req.params.id]);
    if (!ticket) {
      await connection.rollback();
      return res.status(404).json({ message: 'Support ticket not found.' });
    }
    await connection.query(
      `INSERT INTO support_messages (conversation_id, sender_type, sender_user_id, body)
       VALUES (?, 'ADMIN', ?, ?)`,
      [ticket.conversation_id, req.user.id, body]
    );
    await connection.query(
      `UPDATE support_tickets SET status = CASE WHEN status IN ('OPEN','WAITING_FOR_USER') THEN 'IN_PROGRESS' ELSE status END,
       updated_at = NOW() WHERE id = ?`,
      [ticket.id]
    );
    await connection.query('UPDATE support_conversations SET updated_at = NOW() WHERE id = ?', [ticket.conversation_id]);
    await connection.commit();
    res.status(201).json({ sent: true });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

router.patch('/tickets/:id', authorize('ADMIN'), asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid ticket ID.' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[ticket]] = await connection.query('SELECT * FROM support_tickets WHERE id = ? FOR UPDATE', [req.params.id]);
    if (!ticket) {
      await connection.rollback();
      return res.status(404).json({ message: 'Support ticket not found.' });
    }
    const updates = [];
    const values = [];
    if (req.body.status !== undefined) {
      const nextStatus = req.body.status;
      if (!statuses.has(nextStatus) || (nextStatus !== ticket.status && !transitions[ticket.status].has(nextStatus))) {
        await connection.rollback();
        return res.status(400).json({ message: `Invalid status transition from ${ticket.status}.` });
      }
      updates.push('status = ?'); values.push(nextStatus);
    }
    if (req.body.priority !== undefined) {
      if (!priorities.has(req.body.priority)) {
        await connection.rollback();
        return res.status(400).json({ message: 'Invalid priority.' });
      }
      updates.push('priority = ?'); values.push(req.body.priority);
    }
    if (req.body.assignToMe === true) {
      updates.push('assigned_admin_id = ?'); values.push(req.user.id);
    }
    if (req.body.assignToMe === false) updates.push('assigned_admin_id = NULL');
    if (updates.length) {
      values.push(ticket.id);
      await connection.query(`UPDATE support_tickets SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
    }
    await connection.commit();
    res.json({ updated: updates.length > 0 });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

module.exports = router;
