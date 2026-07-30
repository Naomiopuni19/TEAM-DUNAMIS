create table if not exists service_length_options (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  label text not null,
  price_min numeric not null,
  price_max numeric not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table bookings add column if not exists reference_image_url text;
alter table bookings add column if not exists length_label text;