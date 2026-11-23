const pool = require('../config/db');

// Todas las consultas usan parametros ($1, $2...) para evitar inyeccion SQL.
const COLUMNS = 'id, debate_id, user_id, parent_id, stance, content, has_spoilers, created_at';

async function listByDebate(debate_id) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM arguments WHERE debate_id = $1 ORDER BY created_at ASC`,
    [debate_id]
  );
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM arguments WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function create({ debate_id, user_id, parent_id = null, stance, content, has_spoilers = false }) {
  const { rows } = await pool.query(
    `INSERT INTO arguments (debate_id, user_id, parent_id, stance, content, has_spoilers)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${COLUMNS}`,
    [debate_id, user_id, parent_id, stance, content, has_spoilers]
  );
  return rows[0];
}

// Cuenta los votos utiles (+1) y no utiles (-1) de un argumento
async function getVoteCounts(argument_id) {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE value = 1)  AS useful,
       COUNT(*) FILTER (WHERE value = -1) AS not_useful
     FROM argument_votes WHERE argument_id = $1`,
    [argument_id]
  );
  return {
    useful: Number(rows[0].useful),
    not_useful: Number(rows[0].not_useful),
  };
}

module.exports = { listByDebate, getById, create, getVoteCounts };
