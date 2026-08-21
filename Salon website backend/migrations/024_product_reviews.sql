alter table reviews alter column booking_id drop not null;
alter table reviews add column if not exists order_id uuid references orders(id);
alter table reviews add constraint reviews_order_id_unique unique (order_id);