const pool = require('../config/db');

// Un voto de 1 a 5 por usuario y titulo (mismo patron que voteService.js:
// ON CONFLICT actualiza la calificacion si el usuario ya habia calificado).
async function upsertRating({ title_id, user_id, value }) {
  const { rows } = await pool.query(
    `INSERT INTO ratings (title_id, user_id, value)
     VALUES ($1, $2, $3)
     ON CONFLICT (title_id, user_id)
     DO UPDATE SET value = EXCLUDED.value
     RETURNING id, title_id, user_id, value, created_at`,
    [title_id, user_id, value]
  );
  return rows[0];
}

// Promedio y cantidad de calificaciones de un titulo
async function getSummary(title_id) {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(ROUND(AVG(value)::numeric, 1), 0) AS average,
       COUNT(*) AS count
     FROM ratings WHERE title_id = $1`,
    [title_id]
  );
  return { average: Number(rows[0].average), count: Number(rows[0].count) };
}

module.exports = { upsertRating, getSummary };
