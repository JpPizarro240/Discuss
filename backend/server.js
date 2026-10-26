require('dotenv').config(); // Debe ir antes de importar el pool

const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const titleRoutes = require('./src/routes/titleRoutes');

// El servidor no debe arrancar sin secreto JWT
if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el archivo .env');
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.warn('Aviso: JWT_SECRET es muy corto. Usa una cadena aleatoria de al menos 32 caracteres.');
}

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

app.use('/api/auth', authRoutes);
app.use('/api/titles', titleRoutes);

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
