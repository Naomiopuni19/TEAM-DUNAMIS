create table if not exists gift_cards (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  amount numeric(10,2) not null,
  balance numeric(10,2) not null,
  purchaser_name text not null,
  purchaser_email text not null,
  recipient_name text,
  recipient_email text,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gift_cards_code_idx on gift_cards (code);