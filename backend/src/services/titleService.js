const pool = require('../config/db');

// Todas las consultas usan parametros ($1, $2...) para evitar inyeccion SQL.
const COLUMNS = 'id, name, type, genre, release_year, synopsis, poster_url, created_by, created_at';

// Unicas columnas que se pueden modificar (lista blanca)
const UPDATABLE = ['name', 'type', 'genre', 'release_year', 'synopsis', 'poster_url'];

async function list({ type, genre, q, limit, offset }) {
  const conditions = [];
  const params = [];

  if (type) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }
  if (genre) {
    params.push(genre);
    conditions.push(`genre ILIKE $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`name ILIKE $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM titles ${where}
     ORDER BY name ASC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM titles WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function create({ name, type, genre = null, release_year = null, synopsis = null, poster_url = null, created_by }) {
  const { rows } = await pool.query(
    `INSERT INTO titles (name, type, genre, release_year, synopsis, poster_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${COLUMNS}`,
    [name, type, genre, release_year, synopsis, poster_url, created_by]
  );
  return rows[0];
}

async function update(id, fields) {
  const sets = [];
  const params = [];

  for (const column of UPDATABLE) {
    if (fields[column] !== undefined) {
      params.push(fields[column]);
      sets.push(`${column} = $${params.length}`);
    }
  }
  if (sets.length === 0) return getById(id);

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE titles SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING ${COLUMNS}`,
    params
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM titles WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { list, getById, create, update, remove };
