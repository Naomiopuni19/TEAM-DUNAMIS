update service_categories
set image_url = case name
      when 'Braiding' then '/images/services/braiding.jpg'
      when 'Makeup' then '/images/services/makeup.jpg'
      when 'Nails' then '/images/services/nails.jpg'
      when 'Lashes' then '/images/services/lashes.jpg'
      else image_url
    end,
    updated_at = now()
where name in ('Braiding', 'Makeup', 'Nails', 'Lashes');

update services service
set images = array[category.image_url],
    updated_at = now()
from service_categories category
where service.category_id = category.id
  and category.name in ('Braiding', 'Makeup', 'Nails', 'Lashes')
  and service.is_active = true;
