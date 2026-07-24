alter table services
  add column if not exists duration_minutes integer not null default 60;

alter table products
  add column if not exists category text not null default 'Hair Care';

insert into service_categories (name, daily_cap)
values
  ('Braids', 3),
  ('Weaves & Extensions', 5),
  ('Treatments', 8),
  ('Finishing Touch', 8)
on conflict (name) do update
set daily_cap = excluded.daily_cap,
    updated_at = now();

update services
set
  name = 'Knotless Box Braids',
  description = 'Lightweight knotless braids with clean parting and a comfortable finish.',
  category_id = (select id from service_categories where name = 'Braids'),
  duration_minutes = 270,
  price_min = 350,
  price_max = 500,
  images = array['https://sampahallen.github.io/beryl-s-beauty-mark/images/service-lace-install.jpg'],
  is_active = true,
  updated_at = now()
where name in ('Knotless Braids', 'Knotless Box Braids');

update services
set
  name = 'Signature Silk Press',
  description = 'A smooth, full-bodied silk press with hydration and heat protection.',
  category_id = (select id from service_categories where name = 'Treatments'),
  duration_minutes = 90,
  price_min = 180,
  price_max = 250,
  images = array['https://sampahallen.github.io/beryl-s-beauty-mark/images/service-lace-install.jpg'],
  is_active = true,
  updated_at = now()
where name in ('Silk Press', 'Signature Silk Press');

update services
set is_active = false, updated_at = now()
where name = 'Gel Manicure'
   or category_id in (
     select id from service_categories where name in ('Nails', 'Makeup')
   );

insert into services
  (name, description, category_id, duration_minutes, price_min, price_max, images)
select
  seed.name,
  seed.description,
  category.id,
  seed.duration_minutes,
  seed.price_min,
  seed.price_max,
  array['https://sampahallen.github.io/beryl-s-beauty-mark/images/service-lace-install.jpg']
from (
  values
    ('Goddess Braids', 'Soft knotless braids finished with flowing curls.', 'Braids', 240, 420.00, 580.00),
    ('Stitch Cornrows', 'Clean, defined cornrows shaped around your chosen pattern.', 'Braids', 150, 220.00, 320.00),
    ('Frontal Install', 'Lace customisation, secure placement and a natural-looking finish.', 'Weaves & Extensions', 150, 250.00, 380.00),
    ('Traditional Sew-in', 'A secure sew-in with carefully blended leave-out.', 'Weaves & Extensions', 180, 300.00, 450.00),
    ('Microlink Extensions', 'Flexible extensions with natural movement and no adhesive.', 'Weaves & Extensions', 240, 850.00, 1200.00),
    ('Wash & Steam', 'A deep cleanse and steam treatment for softness and moisture.', 'Treatments', 60, 95.00, 140.00),
    ('Wig Revamp', 'Cleaning, reshaping and restyling for an existing wig.', 'Finishing Touch', 90, 120.00, 220.00)
) as seed(name, description, category_name, duration_minutes, price_min, price_max)
join service_categories category on category.name = seed.category_name
where not exists (
  select 1 from services where lower(services.name) = lower(seed.name)
);

update products
set
  category = 'Hair Care',
  images = array['https://sampahallen.github.io/beryl-s-beauty-mark/images/product-hair-mask.jpg'],
  updated_at = now()
where name in ('Hair Growth Oil', 'Edge Control');

update products
set is_active = false, updated_at = now()
where name = 'Nail Cuticle Oil';

insert into products
  (name, description, category, price, stock_qty, images)
select
  seed.name,
  seed.description,
  seed.category,
  seed.price,
  seed.stock_qty,
  array[seed.image]
from (
  values
    ('Signature HD Lace Front Wig', 'Natural-looking HD lace, pre-plucked and finished by hand.', 'Wigs', 4500.00, 8, 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-hd-lace-wig.jpg'),
    ('Everyday Closure Wig', 'A polished, low-maintenance wig designed for everyday wear.', 'Wigs', 3200.00, 10, 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-hd-lace-wig.jpg'),
    ('Raw Burmese Wavy Bundles', 'Soft Burmese wave with full ends and natural movement.', 'Bundles', 1500.00, 18, 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-burmese-wave.jpg'),
    ('Raw Burmese Straight Bundles', 'Silky straight bundles selected for density and longevity.', 'Bundles', 1450.00, 16, 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-burmese-wave.jpg'),
    ('Argan & Keratin Hair Mask', 'Deep-conditioning care for wigs, bundles and natural hair.', 'Hair Care', 380.00, 24, 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-hair-mask.jpg'),
    ('Silk Press Finishing Serum', 'Lightweight shine and heat protection without heavy build-up.', 'Hair Care', 240.00, 20, 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-hair-mask.jpg')
) as seed(name, description, category, price, stock_qty, image)
where not exists (
  select 1 from products where lower(products.name) = lower(seed.name)
);
