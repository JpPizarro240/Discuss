# CineDebate – Backend

API REST de CineDebate, plataforma de crítica, calificación y debate estructurado sobre series y películas. Documentación general del proyecto en el [README principal](../README.md); documentación de los endpoints en [README-API.md](./README-API.md).

## Tecnologías

- Node.js + Express
- PostgreSQL (librería `pg`, consultas parametrizadas)
- JWT (`jsonwebtoken`) y bcrypt para autenticación y contraseñas
- `dotenv` para la configuración y `cors` para el control de orígenes

## Requisitos

- Node.js 20 o superior
- PostgreSQL 15 o superior

## Instalación y ejecución

1. **Instalar dependencias**
   ```bash
   cd backend
   npm install
   ```

2. **Crear la base de datos.** Con `psql`:
   ```bash
   psql -U postgres -f database.sql
   ```
   Con pgAdmin: ejecutar `CREATE DATABASE cinedebate;`, conectarse a esa base y ejecutar el contenido de `database.sql` desde la línea `DROP TABLE` en adelante (sin las dos primeras líneas de `CREATE DATABASE` y `\connect`).

3. **Configurar las variables de entorno.** Copiar `.env.example` como `.env` y completar los valores:
   ```bash
   copy .env.example .env      # Windows
   cp .env.example .env        # Linux / macOS
   ```

   | Variable | Descripción |
   |----------|-------------|
   | `PORT` | Puerto del servidor (por defecto 3000) |
   | `DB_HOST`, `DB_PORT` | Servidor de PostgreSQL (usar `127.0.0.1` si `localhost` apunta a otra instalación) |
   | `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Credenciales y nombre de la base de datos |
   | `JWT_SECRET` | Secreto para firmar los tokens (cadena aleatoria de al menos 32 caracteres) |
   | `JWT_EXPIRES_IN` | Duración del token (por defecto `2h`) |
   | `CORS_ORIGIN` | Orígenes permitidos, separados por coma |

   Para generar un `JWT_SECRET` seguro:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Iniciar el servidor**
   ```bash
   npm run dev     # con recarga automática (nodemon)
   npm start       # modo normal
   ```
   Comprobar en `http://localhost:3000/api/health`: debe responder `"database": "connected"`.

## Estructura

```
backend/
├── database.sql            # Esquema de la BD y datos de prueba
├── server.js               # Punto de entrada de Express
├── postman/                # Colección de pruebas de Postman
└── src/
    ├── config/db.js        # Conexión a PostgreSQL
    ├── routes/             # Definición de rutas
    ├── controllers/        # Lógica de cada endpoint
    ├── services/           # Consultas a la base de datos
    ├── middleware/auth.js  # Verificación de JWT y roles
    └── utils/              # Validaciones de entrada
```

## Modelo de datos

| Tabla | Contenido |
|-------|-----------|
| `users` | Usuarios con rol `user` (Crítico) o `admin` (Moderador) y contraseña con hash bcrypt |
| `titles` | Películas y series del catálogo |
| `debates` | Debates sobre un título (tesis central, categoría y estado) |
| `arguments` | Argumentos de un debate con postura (`a_favor`, `en_contra`, `neutral`) y respuestas anidadas |

Relaciones: un usuario crea títulos, debates y argumentos; un título tiene muchos debates; un debate tiene muchos argumentos; un argumento puede responder a otro (`parent_id`). Las claves foráneas usan `ON DELETE CASCADE` o `SET NULL` según corresponda.

## Pruebas

La colección `postman/CineDebate.postman_collection.json` incluye las pruebas de todos los endpoints con verificación automática de los códigos de respuesta. El detalle de cada endpoint está en [README-API.md](./README-API.md).
