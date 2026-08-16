alter table payments drop constraint if exists payments_payment_type_check;
alter table payments add constraint payments_payment_type_check check (payment_type in ('booking', 'order', 'gift_card'));