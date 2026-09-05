alter table bookings add column if not exists extension_product_id uuid references products(id);
alter table bookings add column if not exists extension_product_name text;
alter table bookings add column if not exists extension_quantity integer;