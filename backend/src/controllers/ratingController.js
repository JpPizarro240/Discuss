const ratingService = require('../services/ratingService');
const titleService = require('../services/titleService');
const { validateRating } = require('../utils/ratingValidator');

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/ratings?title_id=   (publico: promedio y cantidad de votos)
async function summary(req, res, next) {
  try {
    const titleId = parseId(req.query.title_id);
    if (!titleId) return res.status(400).json({ error: 'title_id es obligatorio y debe ser valido' });

    const data = await ratingService.getSummary(titleId);
    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

// POST /api/ratings   (requiere login; 1 a 5; se actualiza si ya habias calificado este titulo)
async function create(req, res, next) {
  try {
    const { errors, title_id, value } = validateRating(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const title = await titleService.getById(title_id);
    if (!title) return res.status(404).json({ error: 'El titulo indicado no existe' });

    await ratingService.upsertRating({ title_id, user_id: req.user.id, value });
    const data = await ratingService.getSummary(title_id);

    return res.json({ message: 'Calificacion registrada correctamente', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = { summary, create };
