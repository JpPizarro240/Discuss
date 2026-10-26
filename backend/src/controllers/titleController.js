const titleService = require('../services/titleService');
const { validateTitle, TYPES } = require('../utils/titleValidator');

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/titles?type=&genre=&q=&limit=&offset=   (publico)
async function list(req, res, next) {
  try {
    const { type, genre, q } = req.query;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    if (type !== undefined && !TYPES.includes(type)) {
      return res.status(400).json({ error: "El filtro type debe ser 'pelicula' o 'serie'" });
    }

    const data = await titleService.list({
      type,
      genre: typeof genre === 'string' ? genre : undefined,
      q: typeof q === 'string' ? q : undefined,
      limit,
      offset,
    });
    return res.json({ data, limit, offset });
  } catch (err) {
    return next(err);
  }
}

// GET /api/titles/:id   (publico)
async function getOne(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Id invalido' });

    const title = await titleService.getById(id);
    if (!title) return res.status(404).json({ error: 'Titulo no encontrado' });

    return res.json({ data: title });
  } catch (err) {
    return next(err);
  }
}

// POST /api/titles   (requiere login)
async function create(req, res, next) {
  try {
    const { errors, data } = validateTitle(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const title = await titleService.create({ ...data, created_by: req.user.id });
    return res.status(201).json({ message: 'Titulo creado correctamente', data: title });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un titulo con ese nombre y ano' });
    }
    return next(err);
  }
}

// PUT/PATCH /api/titles/:id   (requiere login; solo el creador o un admin)
async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Id invalido' });

    const existing = await titleService.getById(id);
    if (!existing) return res.status(404).json({ error: 'Titulo no encontrado' });

    const isOwner = existing.created_by === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo el creador o un admin puede editar este titulo' });
    }

    const { errors, data } = validateTitle(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const title = await titleService.update(id, data);
    return res.json({ message: 'Titulo actualizado correctamente', data: title });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un titulo con ese nombre y ano' });
    }
    return next(err);
  }
}

// DELETE /api/titles/:id   (solo admin; el middleware ya lo verifica)
async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Id invalido' });

    const deleted = await titleService.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Titulo no encontrado' });

    return res.json({ message: 'Titulo eliminado correctamente' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
