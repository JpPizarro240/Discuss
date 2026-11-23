-- =====================================================================
-- Migracion aditiva: agrega la columna has_spoilers a arguments, para
-- poder ocultar un argumento que revela spoilers hasta que el lector
-- decida verlo. No borra ni modifica filas existentes.
--
-- Uso (desde la carpeta backend):
--   psql -U postgres -d cinedebate -f migration_spoilers.sql
-- =====================================================================

ALTER TABLE arguments
  ADD COLUMN IF NOT EXISTS has_spoilers BOOLEAN NOT NULL DEFAULT FALSE;
