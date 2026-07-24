with ranked_services as (
  select
    id,
    row_number() over (
      partition by lower(name)
      order by updated_at desc, created_at desc, id
    ) as duplicate_rank
  from services
  where is_active = true
)
update services
set is_active = false,
    updated_at = now()
where id in (
  select id
  from ranked_services
  where duplicate_rank > 1
);

create unique index if not exists uq_services_active_name
  on services (lower(name))
  where is_active = true;
