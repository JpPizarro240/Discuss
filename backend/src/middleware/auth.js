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
    // algorithms: ['HS256'] fija a mano con que algoritmo se firma el token.
    // Sin esto, alguien podria mandar un JWT firmado con otro algoritmo y
    // jwt.verify igual lo aceptaria.
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    return next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token invalido';
    return res.status(401).json({ error: message });
  }
}

// Restringe una ruta a ciertos roles fijos (ej: solo 'admin'). Debe usarse
// despues de verifyToken porque necesita req.user ya cargado.
// Para el caso "el dueno del recurso o un admin" esto no sirve (el rol
// permitido depende de cada fila), por eso esa validacion se hace a mano
// dentro del controller (ver debateController.close, titleController.update).
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta accion' });
    }
    return next();
  };
}

module.exports = { verifyToken, requireRole };
