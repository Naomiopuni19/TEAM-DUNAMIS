alter table users
  add column if not exists is_active boolean not null default true;

create table if not exists business_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'Beryl''s Beauty Mark',
  phone text not null default '0591911212',
  address text not null default 'Ayeduase, Kumasi',
  opening_hours jsonb not null default '{
    "monday":"09:00-18:00",
    "tuesday":"09:00-18:00",
    "wednesday":"09:00-18:00",
    "thursday":"09:00-18:00",
    "friday":"09:00-18:00",
    "saturday":"09:00-17:00",
    "sunday":"Closed"
  }'::jsonb,
  notifications jsonb not null default '{"bookingEmail":true,"orderEmail":true,"lowStock":true}'::jsonb,
  payment_methods jsonb not null default '{"mobileMoney":true,"cash":true,"card":false}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into business_settings (id)
values (1)
on conflict (id) do nothing;
