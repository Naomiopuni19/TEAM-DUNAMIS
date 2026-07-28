create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default '',
  title text not null,
  subtitle text not null default '',
  image_url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into hero_slides (eyebrow, title, subtitle, image_url, sort_order)
values (
  'Premium hair, personally finished',
  'Beauty, made entirely your own.',
  'Discover quality raw hair, natural-looking wigs and considered salon appointments in Kumasi.',
  'https://sampahallen.github.io/beryl-s-beauty-mark/images/hero-home.jpg',
  1
)
on conflict do nothing;