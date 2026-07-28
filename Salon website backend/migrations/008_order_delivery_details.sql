alter table orders
  add column if not exists delivery_name text,
  add column if not exists delivery_phone text,
  add column if not exists delivery_address text,
  add column if not exists delivery_notes text;