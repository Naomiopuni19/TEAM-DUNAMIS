create table if not exists shop_category_tiles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  label text not null default '',
  copy text not null default '',
  image_url text not null,
  href text not null default '#/shop',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into shop_category_tiles (title, label, copy, image_url, href, sort_order)
values
  ('Signature Wigs', 'Wigs', 'Natural-looking HD lace, full ends and soft movement.', 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-hd-lace-wig.jpg', '#/shop?category=Wigs', 1),
  ('Raw Bundles', 'Bundles', 'Premium textures selected for density, longevity and lustre.', 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-burmese-wave.jpg', '#/shop?category=Bundles', 2),
  ('Hair Care', 'Aftercare', 'Thoughtful formulas to protect your investment between visits.', 'https://sampahallen.github.io/beryl-s-beauty-mark/images/product-hair-mask.jpg', '#/shop?category=Hair Care', 3)
on conflict do nothing;