import { query } from "../config/db.js";

export async function listLengthOptions(serviceId) {
  const result = await query(
    `select id, service_id as "serviceId", label,
            price_min as "priceMin", price_max as "priceMax", sort_order as "sortOrder",
            image_url as "imageUrl"
     from service_length_options
     where service_id = $1
     order by sort_order asc`,
    [serviceId]
  );
  return result.rows;
}

export async function createLengthOption(data) {
  const result = await query(
    `insert into service_length_options (service_id, label, price_min, price_max, sort_order, image_url)
     values ($1, $2, $3, $4, $5, $6)
     returning id, service_id as "serviceId", label,
               price_min as "priceMin", price_max as "priceMax", sort_order as "sortOrder",
               image_url as "imageUrl"`,
    [data.serviceId, data.label, data.priceMin, data.priceMax, data.sortOrder, data.imageUrl || null]
  );
  return result.rows[0];
}

export async function updateLengthOption(id, data) {
  const result = await query(
    `update service_length_options
     set label = coalesce($1, label),
         price_min = coalesce($2, price_min),
         price_max = coalesce($3, price_max),
         sort_order = coalesce($4, sort_order),
         image_url = coalesce($5, image_url)
     where id = $6
     returning id, service_id as "serviceId", label,
               price_min as "priceMin", price_max as "priceMax", sort_order as "sortOrder",
               image_url as "imageUrl"`,
    [data.label, data.priceMin, data.priceMax, data.sortOrder, data.imageUrl, id]
  );
  return result.rows[0] || null;
}

export async function deleteLengthOption(id) {
  const result = await query("delete from service_length_options where id = $1 returning id", [id]);
  return result.rowCount > 0;
}