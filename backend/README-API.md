# CineDebate – Documentación de la API REST

API del backend de CineDebate (Node.js + Express + PostgreSQL).

- **URL base:** `http://localhost:3000/api`
- **Formato:** todas las peticiones y respuestas usan JSON (`Content-Type: application/json`).
- **Autenticación:** JWT en el header `Authorization: Bearer <token>`. El token se obtiene en `POST /auth/login` y dura 2 horas (configurable con `JWT_EXPIRES_IN`).
- **Roles:** `user` (Crítico) y `admin` (Moderador). Todo usuario registrado parte como `user`.

## Resumen de endpoints

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/health` | Público | Estado del servidor y de la base de datos |
| POST | `/auth/register` | Público | Registrar un usuario |
| POST | `/auth/login` | Público | Iniciar sesión y obtener el JWT |
| GET | `/titles` | Público | Listar títulos (con filtros) |
| GET | `/titles/:id` | Público | Obtener un título |
| POST | `/titles` | JWT | Crear un título |
| PUT / PATCH | `/titles/:id` | JWT (creador o `admin`) | Editar un título |
| DELETE | `/titles/:id` | JWT (solo `admin`) | Eliminar un título |

## Códigos HTTP usados

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Recurso creado |
| 400 | Datos inválidos (el campo `details` lista cada problema) |
| 401 | Sin token, token inválido/expirado o credenciales incorrectas |
| 403 | Autenticado, pero sin permisos para la acción |
| 404 | Recurso o ruta no encontrada |
| 409 | Conflicto (usuario, correo o título duplicado) |
| 500 | Error interno del servidor |
| 503 | Base de datos no disponible (solo `/health`) |

Formato de los errores:

```json
{ "error": "Datos invalidos", "details": ["password: debe tener entre 8 y 72 caracteres"] }
```

El campo `details` solo aparece en los errores 400 de validación.

---

## Health

### `GET /health`

**200 OK**
```json
{ "status": "ok", "database": "connected", "time": "2026-10-26T02:15:24.769Z" }
```

**503** – `{ "status": "error", "database": "disconnected" }`

---

## Autenticación

### `POST /auth/register`

Crea un usuario. El rol siempre queda como `user` (cualquier `role` enviado en el body se ignora). La contraseña se guarda con hash bcrypt.

**Body**

| Campo | Tipo | Reglas |
|-------|------|--------|
| `username` | string | 3 a 30 caracteres: letras, números o `_` |
| `email` | string | Formato de correo válido (se guarda en minúsculas) |
| `password` | string | 8 a 72 caracteres, con al menos una letra y un número |

```json
{ "username": "juan", "email": "juan@test.cl", "password": "Clave1234" }
```

**201 Created**
```json
{
  "message": "Usuario registrado correctamente",
  "user": { "id": 1, "username": "juan", "email": "juan@test.cl", "role": "user", "created_at": "2026-10-26T02:15:24.769Z" }
}
```

**400** – datos inválidos · **409** – `{ "error": "El nombre de usuario o el correo ya estan registrados" }`

### `POST /auth/login`

**Body**
```json
{ "email": "juan@test.cl", "password": "Clave1234" }
```

**200 OK**
```json
{
  "message": "Inicio de sesion exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "username": "juan", "email": "juan@test.cl", "role": "user" }
}
```

El payload del JWT contiene `id`, `username` y `role`.

**400** – falta correo o contraseña · **401** – `{ "error": "Credenciales invalidas" }` (mismo mensaje si el correo no existe o la contraseña es incorrecta).

---

## Títulos (películas y series)

Campos de un título: `id`, `name`, `type` (`pelicula` | `serie`), `genre`, `release_year`, `synopsis`, `poster_url`, `created_by`, `created_at`.

### `GET /titles`

Lista los títulos ordenados por nombre. No requiere token.

**Query params (todos opcionales)**

| Parámetro | Descripción |
|-----------|-------------|
| `type` | `pelicula` o `serie` |
| `genre` | Género (sin distinguir mayúsculas), ej. `Drama` |
| `q` | Búsqueda por parte del nombre |
| `limit` | Máximo de resultados (por defecto 20, máximo 100) |
| `offset` | Cantidad de resultados a saltar (por defecto 0) |

Ejemplo: `GET /titles?type=serie&q=break&limit=10`

**200 OK**
```json
{
  "data": [
    {
      "id": 1, "name": "Breaking Bad", "type": "serie", "genre": "Drama", "release_year": 2008,
      "synopsis": "Un profesor de quimica se convierte en fabricante de metanfetamina.",
      "poster_url": null, "created_by": null, "created_at": "2026-10-26T01:40:00.000Z"
    }
  ],
  "limit": 10,
  "offset": 0
}
```

**400** – `{ "error": "El filtro type debe ser 'pelicula' o 'serie'" }`

### `GET /titles/:id`

**200 OK** – `{ "data": { ...título } }`
**400** – `{ "error": "Id invalido" }` · **404** – `{ "error": "Titulo no encontrado" }`

### `POST /titles` 🔒 JWT

**Header:** `Authorization: Bearer <token>`

**Body**

| Campo | Tipo | Reglas |
|-------|------|--------|
| `name` | string | Obligatorio, máximo 150 caracteres |
| `type` | string | Obligatorio: `pelicula` o `serie` |
| `genre` | string | Opcional, máximo 60 caracteres |
| `release_year` | entero | Opcional, entre 1888 y 2100 |
| `synopsis` | string | Opcional, máximo 2000 caracteres |
| `poster_url` | string | Opcional, URL que empiece con `http://` o `https://` |

```json
{ "name": "Dark", "type": "serie", "genre": "Misterio", "release_year": 2017 }
```

**201 Created**
```json
{
  "message": "Titulo creado correctamente",
  "data": { "id": 7, "name": "Dark", "type": "serie", "genre": "Misterio", "release_year": 2017,
            "synopsis": null, "poster_url": null, "created_by": 1, "created_at": "2026-10-26T02:20:00.000Z" }
}
```

**400** datos inválidos · **401** `{ "error": "Token no proporcionado" }` (también `"Token invalido"` o `"Token expirado"`) · **409** `{ "error": "Ya existe un titulo con ese nombre y ano" }`

### `PUT /titles/:id` y `PATCH /titles/:id` 🔒 JWT

Actualiza solo los campos enviados (ambos métodos se comportan igual). Enviar `null` en un campo opcional lo deja vacío. Debe enviarse al menos un campo. Solo el creador del título o un `admin` pueden editarlo.

```json
{ "genre": "Ciencia ficcion", "release_year": 2018 }
```

**200 OK** – `{ "message": "Titulo actualizado correctamente", "data": { ...título } }`
**400** datos inválidos o body vacío · **401** sin token · **403** `{ "error": "Solo el creador o un admin puede editar este titulo" }` · **404** `{ "error": "Titulo no encontrado" }` · **409** duplicado

### `DELETE /titles/:id` 🔒 JWT (solo `admin`)

**200 OK** – `{ "message": "Titulo eliminado correctamente" }`
**401** sin token · **403** `{ "error": "No tienes permisos para realizar esta accion" }` · **404** `{ "error": "Titulo no encontrado" }`

Al eliminar un título también se eliminan sus debates y argumentos (`ON DELETE CASCADE`).

---

## Cómo probar la API

### Con Postman

1. En Postman: **Import** → seleccionar `backend/postman/CineDebate.postman_collection.json`.
2. Con el servidor corriendo (`npm run dev`), ejecutar la colección completa con **Run collection**. El registro genera un usuario único en cada ejecución y el login guarda el token automáticamente.
3. Cada petición incluye pruebas automáticas (códigos de estado esperados) para dejar evidencia del resultado.
4. Para probar `DELETE` como administrador, promover al usuario en la base de datos y volver a iniciar sesión:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'tu_correo@test.cl';
   ```

### Con PowerShell

```powershell
# Registro
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register -ContentType 'application/json' -Body '{"username":"juan","email":"juan@test.cl","password":"Clave1234"}'

# Login (guarda el token)
$t = (Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -ContentType 'application/json' -Body '{"email":"juan@test.cl","password":"Clave1234"}').token

# Ruta protegida
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/titles -Headers @{Authorization="Bearer $t"} -ContentType 'application/json' -Body '{"name":"Dark","type":"serie","genre":"Misterio","release_year":2017}'
```

## Seguridad aplicada

- Contraseñas con hash **bcrypt** (10 rondas); nunca se devuelven en las respuestas.
- **JWT** firmado con `JWT_SECRET` (variable de entorno), con expiración, validado en cada ruta protegida.
- Control de acceso por rol (`requireRole`) y por propietario del recurso.
- Consultas SQL **parametrizadas** y lista blanca de columnas editables (protección contra inyección SQL).
- Validación de todas las entradas; las `poster_url` solo aceptan `http(s)`.
- **CORS** restringido a los orígenes de `CORS_ORIGIN`.
- Mensaje único para credenciales inválidas, para no revelar si un correo existe.
- Secretos fuera del repositorio (`.env` está en `.gitignore`).
