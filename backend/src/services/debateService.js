const pool = require('../config/db');

// Todas las consultas usan parametros ($1, $2...) para evitar inyeccion SQL.
const COLUMNS = 'id, title_id, user_id, thesis, category, status, created_at';

// El WHERE se arma dinamico porque title_id y status son opcionales: si
// vienen los dos se filtra por ambos, si no vienen ninguno se listan todos.
// params.length da el numero correcto de cada $N a medida que se van
// agregando condiciones (si solo hay un filtro, ese filtro es $1; si hay dos, $1 y $2).
async function list({ title_id, status, limit, offset }) {
  const conditions = [];
  const params = [];

  if (title_id) {
    params.push(title_id);
    conditions.push(`title_id = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM debates ${where}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM debates WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function create({ title_id, user_id, thesis, category }) {
  const { rows } = await pool.query(
    `INSERT INTO debates (title_id, user_id, thesis, category)
     VALUES ($1, $2, $3, $4)
     RETURNING ${COLUMNS}`,
    [title_id, user_id, thesis, category]
  );
  return rows[0];
}

// Cierra el debate solo si estaba abierto (evita cerrar dos veces)
async function close(id) {
  const { rows } = await pool.query(
    `UPDATE debates SET status = 'cerrado'
     WHERE id = $1 AND status = 'abierto'
     RETURNING ${COLUMNS}`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { list, getById, create, close };
