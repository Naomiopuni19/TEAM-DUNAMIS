create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id),
  user_id uuid not null references users(id),
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  media_url text,
  media_type text check (media_type in ('photo', 'video')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (booking_id)
);