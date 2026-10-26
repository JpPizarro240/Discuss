const jwt = require('jsonwebtoken');

// Valida el JWT enviado en el header:  Authorization: Bearer <token>
// Si es valido, deja los datos del usuario en req.user.
function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    return next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token invalido';
    return res.status(401).json({ error: message });
  }
}

// Restringe una ruta a ciertos roles. Debe usarse despues de verifyToken.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta accion' });
    }
    return next();
  };
}

module.exports = { verifyToken, requireRole };
