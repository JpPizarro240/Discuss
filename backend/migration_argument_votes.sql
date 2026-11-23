-- =====================================================================
-- Migracion aditiva: agrega la tabla argument_votes a una base
-- "cinedebate" que ya existia (creada antes de RF-05).
-- No borra nada, no toca datos existentes.
--
-- Uso (desde la carpeta backend):
--   psql -U postgres -d cinedebate -f migration_argument_votes.sql
-- =====================================================================

CREATE TABLE IF NOT EXISTS argument_votes (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    argument_id INT      NOT NULL REFERENCES arguments(id) ON DELETE CASCADE,
    user_id     INT      NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    value       SMALLINT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT argument_votes_value_chk CHECK (value IN (1, -1)),
    CONSTRAINT argument_votes_unique    UNIQUE (argument_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_argument_votes_arg ON argument_votes(argument_id);
