-- =====================================================================
-- CineDebate - Estructura de base de datos (PostgreSQL)
--
-- Uso con psql (desde la carpeta backend):
--   psql -U postgres -f database.sql
--
-- Uso con pgAdmin: ejecuta primero "CREATE DATABASE cinedebate;",
-- conectate a esa base y ejecuta el resto del archivo (desde DROP TABLE).
-- =====================================================================

CREATE DATABASE cinedebate;
\connect cinedebate

-- Limpieza (permite volver a ejecutar el script en desarrollo)
DROP TABLE IF EXISTS arguments CASCADE;
DROP TABLE IF EXISTS debates   CASCADE;
DROP TABLE IF EXISTS titles    CASCADE;
DROP TABLE IF EXISTS users     CASCADE;

-- ---------------------------------------------------------------------
-- Usuarios (roles: 'user' = Critico, 'admin' = Moderador)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username      VARCHAR(30)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(10)  NOT NULL DEFAULT 'user',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT users_role_chk CHECK (role IN ('admin', 'user'))
);

-- ---------------------------------------------------------------------
-- Titulos: peliculas y series del catalogo
-- ---------------------------------------------------------------------
CREATE TABLE titles (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    type         VARCHAR(10)  NOT NULL,
    genre        VARCHAR(60),
    release_year SMALLINT,
    synopsis     TEXT,
    poster_url   TEXT,
    created_by   INT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT titles_type_chk CHECK (type IN ('pelicula', 'serie')),
    CONSTRAINT titles_year_chk CHECK (release_year IS NULL OR release_year BETWEEN 1888 AND 2100),
    CONSTRAINT titles_name_year_uq UNIQUE (name, release_year)
);

-- ---------------------------------------------------------------------
-- Debates estructurados sobre un titulo (tesis central + categoria)
-- ---------------------------------------------------------------------
CREATE TABLE debates (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title_id   INT          NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    user_id    INT          NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    thesis     VARCHAR(255) NOT NULL,
    category   VARCHAR(20)  NOT NULL DEFAULT 'otro',
    status     VARCHAR(10)  NOT NULL DEFAULT 'abierto',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT debates_category_chk CHECK (category IN ('interpretacion', 'guion', 'actuacion', 'comparacion', 'otro')),
    CONSTRAINT debates_status_chk   CHECK (status IN ('abierto', 'cerrado'))
);

-- ---------------------------------------------------------------------
-- Argumentos dentro de un debate (con postura y respuestas anidadas)
-- ---------------------------------------------------------------------
CREATE TABLE arguments (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    debate_id  INT         NOT NULL REFERENCES debates(id)   ON DELETE CASCADE,
    user_id    INT         NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    parent_id  INT         REFERENCES arguments(id)          ON DELETE CASCADE,
    stance     VARCHAR(10) NOT NULL,
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT arguments_stance_chk  CHECK (stance IN ('a_favor', 'en_contra', 'neutral')),
    CONSTRAINT arguments_content_chk CHECK (char_length(content) >= 10)
);

-- Indices para consultas frecuentes
CREATE INDEX idx_titles_genre     ON titles(genre);
CREATE INDEX idx_debates_title    ON debates(title_id);
CREATE INDEX idx_arguments_debate ON arguments(debate_id);

-- ---------------------------------------------------------------------
-- Datos iniciales de prueba (catalogo)
-- Nota: los usuarios se crean desde la API (registro) para que la
-- contrasena quede hasheada con bcrypt.
-- ---------------------------------------------------------------------
INSERT INTO titles (name, type, genre, release_year, synopsis) VALUES
('Breaking Bad',  'serie',    'Drama',           2008, 'Un profesor de quimica se convierte en fabricante de metanfetamina.'),
('Inception',     'pelicula', 'Ciencia ficcion', 2010, 'Un ladron entra en los suenos para plantar una idea.'),
('Parasite',      'pelicula', 'Thriller',        2019, 'Una familia pobre se infiltra en la vida de una familia rica.'),
('The Godfather', 'pelicula', 'Crimen',          1972, 'La saga de la familia mafiosa Corleone.'),
('Stranger Things','serie',   'Ciencia ficcion', 2016, 'Un grupo de ninos enfrenta fuerzas sobrenaturales en su pueblo.');
