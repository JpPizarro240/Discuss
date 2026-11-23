-- =====================================================================
-- Migracion aditiva: agrega la tabla ratings (calificacion 1 a 5 de un
-- titulo) a una base "cinedebate" que ya existia. No borra nada.
--
-- Uso (desde la carpeta backend):
--   psql -U postgres -d cinedebate -f migration_ratings.sql
-- =====================================================================

CREATE TABLE IF NOT EXISTS ratings (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title_id   INT      NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    user_id    INT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    value      SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ratings_value_chk CHECK (value BETWEEN 1 AND 5),
    CONSTRAINT ratings_unique    UNIQUE (title_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_title ON ratings(title_id);
