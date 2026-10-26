const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { normalizeEmail, validateRegister, validateLogin } = require('../utils/validators');

const SALT_ROUNDS = 10;
// Hash falso: se compara cuando el correo no existe, para que el tiempo de
// respuesta no revele si un usuario esta registrado.
const DUMMY_HASH = bcrypt.hashSync('contrasena-falsa-123', SALT_ROUNDS);

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const username = req.body.username.trim();
    const email = normalizeEmail(req.body.email);
    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const user = await userService.createUser({ username, email, passwordHash });

    return res.status(201).json({ message: 'Usuario registrado correctamente', user });
  } catch (err) {
    // 23505 = unique_violation en PostgreSQL (username o email repetido)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El nombre de usuario o el correo ya estan registrados' });
    }
    return next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const errors = validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const email = normalizeEmail(req.body.email);
    const user = await userService.findByEmail(email);

    const passwordOk = await bcrypt.compare(
      req.body.password,
      user ? user.password_hash : DUMMY_HASH
    );

    // Mismo mensaje si falla el correo o la contrasena
    if (!user || !passwordOk) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    return res.json({
      message: 'Inicio de sesion exitoso',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };
