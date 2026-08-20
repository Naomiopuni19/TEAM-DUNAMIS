create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  price numeric(10,2) not null,
  stock_qty integer not null default 0,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_variants_product_id_idx on product_variants (product_id);

alter table order_items add column if not exists variant_id uuid references product_variants(id);
alter table order_items add column if not exists variant_label text;