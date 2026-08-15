alter table service_length_options add column if not exists image_url text;

alter table bookings add column if not exists custom_length_request text;
alter table bookings add column if not exists custom_length_price numeric(10,2);
alter table bookings add column if not exists custom_length_status text;