require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_support.sql'), 'utf8');
  const statements = sql.split(';').map((statement) => statement.trim()).filter(Boolean);
  const connection = await pool.getConnection();
  try {
    for (const statement of statements) await connection.query(statement);
    console.log('Support tables are ready.');
  } finally {
    connection.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error('Support migration failed:', error.message);
  process.exitCode = 1;
  pool.end();
});
