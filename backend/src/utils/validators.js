// Validaciones de entrada para autenticacion (funciones puras, sin dependencias)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9_]{3,30}$/;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateRegister(body) {
  const { username, email, password } = body || {};
  const errors = [];

  if (typeof username !== 'string' || !USERNAME_RE.test(username.trim())) {
    errors.push('username: debe tener 3 a 30 caracteres (letras, numeros o guion bajo)');
  }

  if (typeof email !== 'string' || email.length > 255 || !EMAIL_RE.test(email.trim())) {
    errors.push('email: formato de correo invalido');
  }

  if (typeof password !== 'string') {
    errors.push('password: es obligatoria');
  } else {
    // bcrypt solo procesa los primeros 72 bytes
    if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
      errors.push('password: debe tener entre 8 y 72 caracteres');
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      errors.push('password: debe incluir al menos una letra y un numero');
    }
  }

  return errors;
}

function validateLogin(body) {
  const { email, password } = body || {};
  const errors = [];

  if (typeof email !== 'string' || email.trim() === '') {
    errors.push('email: es obligatorio');
  }
  if (typeof password !== 'string' || password === '') {
    errors.push('password: es obligatoria');
  }

  return errors;
}

module.exports = { normalizeEmail, validateRegister, validateLogin };
