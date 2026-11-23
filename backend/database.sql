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

-- Limpieza (permite volver a ejecutar el script en desarrollo).
-- El orden importa: se borra primero lo que depende de otra tabla por FK,
-- si no Postgres tira error de dependencia.
DROP TABLE IF EXISTS ratings        CASCADE;
DROP TABLE IF EXISTS argument_votes CASCADE;
DROP TABLE IF EXISTS arguments CASCADE;
DROP TABLE IF EXISTS debates   CASCADE;
DROP TABLE IF EXISTS titles    CASCADE;
DROP TABLE IF EXISTS users     CASCADE;

-- ---------------------------------------------------------------------
-- Usuarios (roles: 'user' = Critico, 'admin' = Moderador)
-- ---------------------------------------------------------------------
-- GENERATED ALWAYS AS IDENTITY es el reemplazo moderno de SERIAL para ids
-- autoincrementales; se usa igual en todas las tablas de este archivo.
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
-- Argumentos dentro de un debate (con postura, respuestas anidadas y
-- marca opcional de spoiler para RF anti-spoiler)
-- ---------------------------------------------------------------------
CREATE TABLE arguments (
    id           INT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    debate_id    INT         NOT NULL REFERENCES debates(id)   ON DELETE CASCADE,
    user_id      INT         NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    parent_id    INT         REFERENCES arguments(id)          ON DELETE CASCADE,
    stance       VARCHAR(10) NOT NULL,
    content      TEXT        NOT NULL,
    has_spoilers BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT arguments_stance_chk  CHECK (stance IN ('a_favor', 'en_contra', 'neutral')),
    CONSTRAINT arguments_content_chk CHECK (char_length(content) >= 10)
);

-- ---------------------------------------------------------------------
-- Votos de utilidad sobre un argumento (RF-05: un voto por usuario,
-- util o no util; no se permite votar el propio argumento, esa regla
-- se valida en el backend porque necesita comparar con el usuario autenticado).
-- La restriccion UNIQUE de abajo es la que de verdad impide el voto doble:
-- aunque el frontend desactive el boton, la base de datos lo rechaza igual.
-- ---------------------------------------------------------------------
CREATE TABLE argument_votes (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    argument_id INT      NOT NULL REFERENCES arguments(id) ON DELETE CASCADE,
    user_id     INT      NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    value       SMALLINT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT argument_votes_value_chk CHECK (value IN (1, -1)),
    CONSTRAINT argument_votes_unique    UNIQUE (argument_id, user_id)
);

-- ---------------------------------------------------------------------
-- Calificacion de 1 a 5 estrellas de un titulo (un voto por usuario,
-- mismo mecanismo que argument_votes)
-- ---------------------------------------------------------------------
CREATE TABLE ratings (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title_id   INT      NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    user_id    INT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    value      SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ratings_value_chk CHECK (value BETWEEN 1 AND 5),
    CONSTRAINT ratings_unique    UNIQUE (title_id, user_id)
);

-- Indices para consultas frecuentes
CREATE INDEX idx_titles_genre        ON titles(genre);
CREATE INDEX idx_debates_title       ON debates(title_id);
CREATE INDEX idx_arguments_debate    ON arguments(debate_id);
CREATE INDEX idx_argument_votes_arg  ON argument_votes(argument_id);
CREATE INDEX idx_ratings_title       ON ratings(title_id);

-- ---------------------------------------------------------------------
-- Datos iniciales de prueba (catalogo)
-- Nota: los usuarios se crean desde la API (registro) para que la
-- contrasena quede hasheada con bcrypt. El primer admin se promueve
-- a mano con un UPDATE (ver README-API.md), no existe endpoint para crear
-- administradores desde la API.
-- ---------------------------------------------------------------------
INSERT INTO titles (name, type, genre, release_year, synopsis) VALUES
('Breaking Bad',        'serie',    'Drama',           2008, 'Un profesor de quimica se convierte en fabricante de metanfetamina.'),
('Inception',           'pelicula', 'Ciencia ficcion', 2010, 'Un ladron entra en los suenos para plantar una idea.'),
('Parasite',            'pelicula', 'Thriller',        2019, 'Una familia pobre se infiltra en la vida de una familia rica.'),
('The Godfather',       'pelicula', 'Crimen',          1972, 'La saga de la familia mafiosa Corleone.'),
('Stranger Things',     'serie',    'Ciencia ficcion', 2016, 'Un grupo de ninos enfrenta fuerzas sobrenaturales en su pueblo.'),
('The Office',          'serie',    'Comedia',         2005, 'El dia a dia de los empleados de una oficina de papel en Scranton.'),
('Game of Thrones',     'serie',    'Fantasia',        2011, 'Varias familias nobles luchan por el control de los Siete Reinos.'),
('Pulp Fiction',        'pelicula', 'Crimen',          1994, 'Historias cruzadas de criminales en Los Angeles.'),
('The Dark Knight',     'pelicula', 'Accion',          2008, 'Batman enfrenta al Joker, un criminal que siembra el caos en Gotham.'),
('Interstellar',        'pelicula', 'Ciencia ficcion', 2014, 'Un grupo de astronautas busca un nuevo hogar para la humanidad.'),
('The Mandalorian',     'serie',    'Ciencia ficcion', 2019, 'Un cazarrecompensas protege a un misterioso nino en los confines de la galaxia.'),
('Friends',             'serie',    'Comedia',         1994, 'Seis amigos viven sus veintes y treintas en Nueva York.'),
('The Shawshank Redemption', 'pelicula', 'Drama',      1994, 'Un hombre condenado injustamente busca esperanza dentro de una prision.'),
('Black Mirror',        'serie',    'Ciencia ficcion', 2011, 'Historias independientes sobre los efectos oscuros de la tecnologia.'),
('La La Land',          'pelicula', 'Musical',         2016, 'Un pianista de jazz y una actriz persiguen sus suenos en Los Angeles.'),
('Chernobyl',           'serie',    'Drama',           2019, 'La reconstruccion del desastre nuclear de Chernobyl y su encubrimiento.'),
('Spirited Away',       'pelicula', 'Animacion',       2001, 'Una nina queda atrapada en un mundo magico gobernado por espiritus.'),
('Better Call Saul',    'serie',    'Drama',           2015, 'Los origenes de un abogado que termina convertido en Saul Goodman.'),
('Whiplash',            'pelicula', 'Drama',           2014, 'Un joven baterista es presionado al limite por un profesor implacable.'),
('The Queen''s Gambit', 'serie',    'Drama',           2020, 'Una joven prodigio del ajedrez lucha contra sus propios demonios.');
