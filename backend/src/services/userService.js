const pool = require('../config/db');

// Todas las consultas son parametrizadas ($1, $2...) para evitar inyeccion SQL.

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, username, email, password_hash, role FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

// El rol no se recibe como parametro: la BD asigna 'user' por defecto.
async function createUser({ username, email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, role, created_at`,
    [username, email, passwordHash]
  );
  return rows[0];
}

module.exports = { findByEmail, createUser };
