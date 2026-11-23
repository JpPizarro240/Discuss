// Validacion y limpieza de los datos de un debate (sigue el mismo patron
// que titleValidator.js: devuelve { errors, data }).

const CATEGORIES = ['interpretacion', 'guion', 'actuacion', 'comparacion', 'otro'];

function isNonEmptyString(v, max) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

function validateDebate(body) {
  const input = body || {};
  const errors = [];
  const data = {};

  const titleId = Number(input.title_id);
  if (!Number.isInteger(titleId) || titleId <= 0) {
    errors.push('title_id: debe ser un numero entero valido');
  } else {
    data.title_id = titleId;
  }

  if (!isNonEmptyString(input.thesis, 255)) {
    errors.push('thesis: obligatoria, maximo 255 caracteres');
  } else {
    data.thesis = input.thesis.trim();
  }

  if (input.category !== undefined && input.category !== null) {
    if (!CATEGORIES.includes(input.category)) {
      errors.push(`category: debe ser una de: ${CATEGORIES.join(', ')}`);
    } else {
      data.category = input.category;
    }
  } else {
    data.category = 'otro';
  }

  return { errors, data };
}

module.exports = { validateDebate, CATEGORIES };
