-- Fix: Postgres folded camelCase to lowercase (kept underscores). Rename to snake_case.
ALTER TABLE listings RENAME COLUMN name_zhhans TO name_zh_hans;
ALTER TABLE listings RENAME COLUMN description_zhhans TO description_zh_hans;
ALTER TABLE listings RENAME COLUMN district_zhhans TO district_zh_hans;
ALTER TABLE listings RENAME COLUMN address_zhhans TO address_zh_hans;

-- Reload PostgREST cache so new column names are picked up immediately
NOTIFY pgrst, 'reload schema';
