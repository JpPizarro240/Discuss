-- =====================================================================
-- Migracion aditiva: agrega mas peliculas/series al catalogo de una base
-- que ya existia. Usa ON CONFLICT DO NOTHING (sobre la UNIQUE de
-- name+release_year) para que se pueda correr mas de una vez sin duplicar.
--
-- Uso (desde la carpeta backend):
--   psql -U postgres -d cinedebate -f migration_more_titles.sql
-- =====================================================================

INSERT INTO titles (name, type, genre, release_year, synopsis) VALUES
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
('The Queen''s Gambit', 'serie',    'Drama',           2020, 'Una joven prodigio del ajedrez lucha contra sus propios demonios.')
ON CONFLICT (name, release_year) DO NOTHING;
