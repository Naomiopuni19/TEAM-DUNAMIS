alter table bookings add column if not exists confirmation_code text;

update bookings
set confirmation_code = upper(substring(md5(random()::text) from 1 for 6))
where confirmation_code is null;