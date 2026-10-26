// Validacion y limpieza de los datos de un titulo (pelicula o serie).
// Devuelve { errors, data }: data solo contiene campos permitidos y ya saneados.

const TYPES = ['pelicula', 'serie'];

function isNonEmptyString(v, max) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

// partial = true: solo se validan los campos enviados (para PUT/PATCH)
function validateTitle(body, { partial = false } = {}) {
  const input = body || {};
  const errors = [];
  const data = {};

  // name (obligatorio al crear)
  if (input.name !== undefined || !partial) {
    if (!isNonEmptyString(input.name, 150)) {
      errors.push('name: obligatorio, maximo 150 caracteres');
    } else {
      data.name = input.name.trim();
    }
  }

  // type (obligatorio al crear)
  if (input.type !== undefined || !partial) {
    if (!TYPES.includes(input.type)) {
      errors.push("type: debe ser 'pelicula' o 'serie'");
    } else {
      data.type = input.type;
    }
  }

  // Campos opcionales (se permite null para dejarlos vacios)
  if (input.genre !== undefined) {
    if (input.genre === null) data.genre = null;
    else if (!isNonEmptyString(input.genre, 60)) errors.push('genre: texto de maximo 60 caracteres');
    else data.genre = input.genre.trim();
  }

  if (input.release_year !== undefined) {
    if (input.release_year === null) data.release_year = null;
    else if (!Number.isInteger(input.release_year) || input.release_year < 1888 || input.release_year > 2100) {
      errors.push('release_year: numero entero entre 1888 y 2100');
    } else data.release_year = input.release_year;
  }

  if (input.synopsis !== undefined) {
    if (input.synopsis === null) data.synopsis = null;
    else if (!isNonEmptyString(input.synopsis, 2000)) errors.push('synopsis: texto de maximo 2000 caracteres');
    else data.synopsis = input.synopsis.trim();
  }

  if (input.poster_url !== undefined) {
    if (input.poster_url === null) data.poster_url = null;
    else if (!isNonEmptyString(input.poster_url, 500) || !/^https?:\/\//i.test(input.poster_url.trim())) {
      errors.push('poster_url: debe ser una URL http(s) de maximo 500 caracteres');
    } else data.poster_url = input.poster_url.trim();
  }

  if (partial && errors.length === 0 && Object.keys(data).length === 0) {
    errors.push('Debes enviar al menos un campo para actualizar');
  }

  return { errors, data };
}

module.exports = { validateTitle, TYPES };
