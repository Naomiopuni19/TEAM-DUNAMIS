insert into service_categories (name, daily_cap)
values
  ('Hair Styling', 8),
  ('Braids', 5),
  ('Nails', 10),
  ('Makeup', 4)
on conflict (name) do nothing;

insert into services (name, description, category_id, price_min, price_max)
select
  'Silk Press',
  'Wash, blow dry, and silk press styling.',
  id,
  120.00,
  180.00
from service_categories
where name = 'Hair Styling'
  and not exists (select 1 from services where name = 'Silk Press');

insert into services (name, description, category_id, price_min, price_max)
select
  'Knotless Braids',
  'Protective knotless braids with clean parting.',
  id,
  250.00,
  450.00
from service_categories
where name = 'Braids'
  and not exists (select 1 from services where name = 'Knotless Braids');

insert into services (name, description, category_id, price_min, price_max)
select
  'Gel Manicure',
  'Gel polish manicure with nail shaping.',
  id,
  80.00,
  120.00
from service_categories
where name = 'Nails'
  and not exists (select 1 from services where name = 'Gel Manicure');

insert into products (name, description, price, stock_qty)
select *
from (
  values
    ('Hair Growth Oil', 'Lightweight scalp oil for protective styles.', 45.00, 25),
    ('Edge Control', 'Strong hold edge control with shine.', 30.00, 40),
    ('Nail Cuticle Oil', 'Hydrating oil for nail and cuticle care.', 20.00, 30)
) as seed(name, description, price, stock_qty)
where not exists (select 1 from products where products.name = seed.name);
