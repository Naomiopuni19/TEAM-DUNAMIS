alter table orders add column if not exists gift_card_code text;
alter table orders add column if not exists gift_card_discount numeric(10,2) not null default 0;