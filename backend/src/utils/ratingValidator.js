// Validacion de una calificacion (1 a 5 estrellas). Mismo patron de
// validacion manual que el resto del proyecto (sin Joi ni express-validator).
function validateRating(body) {
  const input = body || {};
  const errors = [];

  const title_id = Number(input.title_id);
  if (!Number.isInteger(title_id) || title_id <= 0) {
    errors.push('title_id: debe ser un numero entero valido');
  }

  const value = Number(input.value);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    errors.push('value: debe ser un numero entero entre 1 y 5');
  }

  return { errors, title_id, value };
}

module.exports = { validateRating };
