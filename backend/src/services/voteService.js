const pool = require('../config/db');

// Un voto por usuario y argumento (UNIQUE en la tabla argument_votes).
// Si el usuario ya habia votado ese argumento, se actualiza su voto en vez
// de crear uno nuevo (asi "un voto por usuario" se cumple a nivel de BD).
async function upsertVote({ argument_id, user_id, value }) {
  const { rows } = await pool.query(
    `INSERT INTO argument_votes (argument_id, user_id, value)
     VALUES ($1, $2, $3)
     ON CONFLICT (argument_id, user_id)
     DO UPDATE SET value = EXCLUDED.value
     RETURNING id, argument_id, user_id, value, created_at`,
    [argument_id, user_id, value]
  );
  return rows[0];
}

module.exports = { upsertVote };
