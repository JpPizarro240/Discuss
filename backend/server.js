require('dotenv').config(); // Debe ir antes de importar el pool

const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const titleRoutes = require('./src/routes/titleRoutes');
const debateRoutes = require('./src/routes/debateRoutes');
const argumentRoutes = require('./src/routes/argumentRoutes');
const ratingRoutes = require('./src/routes/ratingRoutes');

// Este archivo es el punto de entrada del backend: arma la app de Express,
// conecta los middlewares globales y monta el router de cada recurso
// (auth, titles, debates, arguments, ratings). La logica de verdad vive en
// controllers/services, aca solo se juntan las piezas.

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
// CORS_ORIGIN admite varios origenes separados por coma, por si se prueba
// desde el navegador (5173) y desde el emulador de Ionic (8100) al mismo tiempo
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

// Cada recurso tiene su propio router. Todas las respuestas siguen el mismo
// formato ({ data } si sale bien, { error, details } si falla) para no andar
// explicando un formato distinto por cada endpoint en la defensa.
app.use('/api/auth', authRoutes);
app.use('/api/titles', titleRoutes);
app.use('/api/debates', debateRoutes);
app.use('/api/arguments', argumentRoutes);
app.use('/api/ratings', ratingRoutes);

// --- 404 y manejo de errores ---
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Handler final de errores: si algun controller llama a next(err), cae aca.
// Asi el cliente nunca recibe un stack trace ni detalles internos del servidor.
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
