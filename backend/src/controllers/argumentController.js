const argumentService = require('../services/argumentService');
const debateService = require('../services/debateService');
const voteService = require('../services/voteService');
const { validateArgument, validateVote } = require('../utils/argumentValidator');

// Convierte un parametro de ruta/query a un id valido (entero positivo) o null.
// Se repite igual en los otros controllers en vez de centralizarlo: son 3 lineas,
// no vale la pena crear un archivo compartido solo para esto.
function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/arguments?debate_id=   (publico; incluye el conteo de votos de cada argumento)
async function list(req, res, next) {
  try {
    const debateId = parseId(req.query.debate_id);
    if (!debateId) {
      return res.status(400).json({ error: 'debate_id es obligatorio y debe ser valido' });
    }

    const rows = await argumentService.listByDebate(debateId);

    const data = await Promise.all(
      rows.map(async (arg) => ({ ...arg, votes: await argumentService.getVoteCounts(arg.id) }))
    );

    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

// POST /api/arguments   (requiere login; declarar postura es obligatorio; el debate debe estar abierto)
async function create(req, res, next) {
  try {
    const { errors, data } = validateArgument(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const debate = await debateService.getById(data.debate_id);
    if (!debate) return res.status(404).json({ error: 'El debate indicado no existe' });
    if (debate.status === 'cerrado') {
      return res.status(403).json({ error: 'No se puede argumentar en un debate cerrado' });
    }

    if (data.parent_id) {
      const parent = await argumentService.getById(data.parent_id);
      if (!parent || parent.debate_id !== data.debate_id) {
        return res.status(400).json({ error: 'parent_id invalido para este debate' });
      }
    }

    const argument = await argumentService.create({ ...data, user_id: req.user.id });
    return res.status(201).json({ message: 'Argumento publicado correctamente', data: argument });
  } catch (err) {
    return next(err);
  }
}

// POST /api/arguments/:id/vote   (requiere login; no se puede votar el propio argumento)
async function vote(req, res, next) {
  try {
    const argumentId = parseId(req.params.id);
    if (!argumentId) return res.status(400).json({ error: 'Id invalido' });

    const { errors, value } = validateVote(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Datos invalidos', details: errors });
    }

    const argument = await argumentService.getById(argumentId);
    if (!argument) return res.status(404).json({ error: 'Argumento no encontrado' });

    // Regla de negocio "no autovoto": no se puede expresar con requireRole
    // porque depende del dueno de ESE argumento, no de un rol fijo. Se valida
    // aca a mano. Ademas la tabla argument_votes tiene un UNIQUE(argument_id,
    // user_id), asi que "un voto por usuario" queda reforzado en la BD.
    if (argument.user_id === req.user.id) {
      return res.status(403).json({ error: 'No puedes votar tu propio argumento' });
    }

    await voteService.upsertVote({ argument_id: argumentId, user_id: req.user.id, value });
    const votes = await argumentService.getVoteCounts(argumentId);

    return res.json({ message: 'Voto registrado correctamente', data: { argument_id: argumentId, votes } });
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, create, vote };
