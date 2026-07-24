import { query } from "../config/db.js";

export async function listCategories() {
  const result = await query(
    `select id, name, daily_cap as "dailyCap", image_url as "imageUrl"
     from service_categories
     where is_active = true
     order by
       case name
         when 'Braiding' then 1
         when 'Makeup' then 2
         when 'Nails' then 3
         when 'Lashes' then 4
         else 5
       end`
  );
  return result.rows;
}

export async function updateCategoryCap(id, dailyCap) {
  const result = await query(
    `update service_categories
     set daily_cap = $1, updated_at = now()
     where id = $2
     returning id, name, daily_cap as "dailyCap", image_url as "imageUrl"`,
    [dailyCap, id]
  );
  return result.rows[0] || null;
}
