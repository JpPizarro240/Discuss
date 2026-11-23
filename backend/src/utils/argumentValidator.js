// Validacion de argumentos y votos (mismo patron manual que validators.js:
// sin libreria externa, solo funciones que devuelven { errors, data }).

const STANCES = ['a_favor', 'en_contra', 'neutral'];

function validateArgument(body) {
  const input = body || {};
  const errors = [];
  const data = {};

  const debateId = Number(input.debate_id);
  if (!Number.isInteger(debateId) || debateId <= 0) {
    errors.push('debate_id: debe ser un numero entero valido');
  } else {
    data.debate_id = debateId;
  }

  if (!STANCES.includes(input.stance)) {
    errors.push(`stance: debe ser una de: ${STANCES.join(', ')}`);
  } else {
    data.stance = input.stance;
  }

  if (
    typeof input.content !== 'string' ||
    input.content.trim().length < 10 ||
    input.content.trim().length > 2000
  ) {
    errors.push('content: obligatorio, entre 10 y 2000 caracteres');
  } else {
    data.content = input.content.trim();
  }

  // parent_id: opcional, permite responder/refutar otro argumento del mismo debate
  if (input.parent_id !== undefined && input.parent_id !== null) {
    const parentId = Number(input.parent_id);
    if (!Number.isInteger(parentId) || parentId <= 0) {
      errors.push('parent_id: debe ser un numero entero valido');
    } else {
      data.parent_id = parentId;
    }
  }

  // has_spoilers: opcional, por defecto false (funcion anti-spoiler)
  data.has_spoilers = input.has_spoilers === true;

  return { errors, data };
}

function validateVote(body) {
  const input = body || {};
  const errors = [];
  const value = Number(input.value);

  if (value !== 1 && value !== -1) {
    errors.push('value: debe ser 1 (util) o -1 (no util)');
  }

  return { errors, value };
}

module.exports = { validateArgument, validateVote, STANCES };
