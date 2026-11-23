const debateService = require('../services/debateService');
const titleService = require('../services/titleService');
const { validateDebate } = require('../utils/debateValidator');

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Filtros por query string (?title_id=&status=) en vez de rutas anidadas
// tipo /titles/:id/debates. Es el mismo estilo que ya usa titleController
// para type/genre/q, asi no hay dos convenciones de rutas distintas en la API.

// GET /api/debates?title_id=&status=&limit=&offset=   (publico)
async function list(req, res, next) {
  try {
    let title_id;
    if (req.query.title_id !== undefined) {
      title_id = parseId(req.query.title_id);
      if (!title_id) return res.status(400).json({ error: 'title_id invalido' });
    }

    const status = req.query.status;
    if (status !== undefined && !['abierto', 'cerrado'].includes(status)) {
      return res.status(400).json({ error: "status debe ser 'abierto' o 'cerrado'" });
    }

    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const data = await debateService.list({ title_id, status, limit, offset });
    return res.json({ data, limit, offset });
  } catch (err) {
    return next(err);
  }
}

// GET /api/debates/:id   (publico)
async function getOne(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Id invalido' });

    const debate = await debateService.getById(id);
    if (!debate) return res.status(404).json({ error: 'Debate no encontrado' });

    return res.json({ data: debate });
  } catch (err) {
    return next(err);
  }
}

// POST /api/debates   (requiere login)
async function create(req, res, next) {
  try {
    const { errors, data } = validateDebate(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const title = await titleService.getById(data.title_id);
    if (!title) return res.status(404).json({ error: 'El titulo indicado no existe' });

    const debate = await debateService.create({ ...data, user_id: req.user.id });
    return res.status(201).json({ message: 'Debate creado correctamente', data: debate });
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/debates/:id/close   (solo el creador del debate o un admin)
async function close(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Id invalido' });

    const debate = await debateService.getById(id);
    if (!debate) return res.status(404).json({ error: 'Debate no encontrado' });

    // "Dueno o admin" es una regla por fila, no un rol fijo, asi que no se
    // puede usar requireRole aca: se compara a mano con el usuario del token.
    const isOwner = debate.user_id === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo el creador o un admin puede cerrar este debate' });
    }

    const closed = await debateService.close(id);
    if (!closed) return res.status(409).json({ error: 'El debate ya estaba cerrado' });

    return res.json({ message: 'Debate cerrado correctamente', data: closed });
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, close };
