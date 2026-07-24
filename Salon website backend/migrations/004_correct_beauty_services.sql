alter table service_categories
  add column if not exists image_url text;

alter table service_categories
  add column if not exists is_active boolean not null default true;

update service_categories
set is_active = false,
    updated_at = now();

insert into service_categories (name, daily_cap, image_url, is_active)
values
  (
    'Braiding',
    3,
    '/images/services/braiding.jpg',
    true
  ),
  (
    'Makeup',
    6,
    '/images/services/makeup.jpg',
    true
  ),
  (
    'Nails',
    8,
    '/images/services/nails.jpg',
    true
  ),
  (
    'Lashes',
    6,
    '/images/services/lashes.jpg',
    true
  )
on conflict (name) do update
set daily_cap = excluded.daily_cap,
    image_url = excluded.image_url,
    is_active = excluded.is_active,
    updated_at = now();

update services
set is_active = false,
    updated_at = now();

create temporary table desired_services (
  name text primary key,
  description text not null,
  category_name text not null,
  duration_minutes integer not null,
  price_min numeric(10, 2) not null,
  price_max numeric(10, 2) not null
) on commit drop;

insert into desired_services
  (name, description, category_name, duration_minutes, price_min, price_max)
values
  (
    'Knotless Box Braids',
    'Lightweight knotless braids with neat parting and a comfortable, natural finish.',
    'Braiding',
    270,
    350,
    500
  ),
  (
    'Stitch Cornrows',
    'Clean, defined cornrows shaped around your preferred pattern and finish.',
    'Braiding',
    150,
    220,
    320
  ),
  (
    'Goddess Braids',
    'Soft braids finished with flowing curls for an elegant, textured look.',
    'Braiding',
    240,
    420,
    580
  ),
  (
    'Soft Glam Makeup',
    'A polished, radiant look with soft definition for everyday events and celebrations.',
    'Makeup',
    90,
    250,
    350
  ),
  (
    'Full Glam Makeup',
    'A camera-ready finish with fuller coverage, defined eyes and a tailored lip.',
    'Makeup',
    120,
    350,
    500
  ),
  (
    'Bridal Makeup',
    'Long-wear bridal makeup planned around your features, outfit and ceremony.',
    'Makeup',
    150,
    600,
    900
  ),
  (
    'Classic Manicure',
    'Nail shaping, cuticle care and a clean polish finish.',
    'Nails',
    45,
    80,
    120
  ),
  (
    'Gel Manicure',
    'A tidy manicure finished with durable, high-shine gel colour.',
    'Nails',
    60,
    120,
    180
  ),
  (
    'Acrylic Full Set',
    'Sculpted acrylic extensions shaped and finished in your preferred length and colour.',
    'Nails',
    120,
    220,
    350
  ),
  (
    'Classic Lash Set',
    'Natural-looking individual lash extensions for subtle length and definition.',
    'Lashes',
    120,
    250,
    350
  ),
  (
    'Hybrid Lash Set',
    'A balanced blend of classic and volume lashes for soft fullness.',
    'Lashes',
    150,
    320,
    450
  ),
  (
    'Lash Refill',
    'A careful refresh that replaces grown-out extensions and restores an even finish.',
    'Lashes',
    75,
    150,
    250
  );

update services service
set description = desired.description,
    category_id = category.id,
    duration_minutes = desired.duration_minutes,
    price_min = desired.price_min,
    price_max = desired.price_max,
    images = array[category.image_url],
    is_active = true,
    updated_at = now()
from desired_services desired
join service_categories category on category.name = desired.category_name
where lower(service.name) = lower(desired.name);

insert into services
  (name, description, category_id, duration_minutes, price_min, price_max, images, is_active)
select
  desired.name,
  desired.description,
  category.id,
  desired.duration_minutes,
  desired.price_min,
  desired.price_max,
  array[category.image_url],
  true
from desired_services desired
join service_categories category on category.name = desired.category_name
where not exists (
  select 1
  from services
  where lower(services.name) = lower(desired.name)
);
