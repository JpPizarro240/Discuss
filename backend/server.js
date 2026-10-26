require('dotenv').config(); // Debe ir antes de importar el pool

const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globales ---
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:8100')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// --- Rutas ---
// Comprueba que el servidor y la base de datos responden
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ status: 'ok', database: 'connected', time: result.rows[0].now });
  } catch (err) {
    console.error('Health check fallido:', err.message);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// (Paso 2) rutas de autenticacion  -> /api/auth
// (Paso 3) rutas del CRUD          -> /api/titles

// --- 404 y manejo de errores ---
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// --- Arranque ---
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('Conexion a PostgreSQL correcta');
  } catch (err) {
    console.error('No se pudo conectar a PostgreSQL:', err.message);
  }
});
