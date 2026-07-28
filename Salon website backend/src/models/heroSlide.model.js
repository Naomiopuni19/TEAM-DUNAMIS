import { query } from "../config/db.js";

export async function listActiveHeroSlides() {
  const result = await query(
    `select id, eyebrow, title, subtitle, image_url as "imageUrl", sort_order as "sortOrder"
     from hero_slides
     where is_active = true
     order by sort_order asc`
  );
  return result.rows;
}

export async function listAllHeroSlides() {
  const result = await query(
    `select id, eyebrow, title, subtitle, image_url as "imageUrl",
            sort_order as "sortOrder", is_active as "isActive"
     from hero_slides
     order by sort_order asc`
  );
  return result.rows;
}

export async function createHeroSlide(data) {
  const result = await query(
    `insert into hero_slides (eyebrow, title, subtitle, image_url, sort_order)
     values ($1, $2, $3, $4, $5)
     returning id, eyebrow, title, subtitle, image_url as "imageUrl",
               sort_order as "sortOrder", is_active as "isActive"`,
    [data.eyebrow, data.title, data.subtitle, data.imageUrl, data.sortOrder]
  );
  return result.rows[0];
}

export async function updateHeroSlide(id, data) {
  const result = await query(
    `update hero_slides
     set eyebrow = coalesce($1, eyebrow),
         title = coalesce($2, title),
         subtitle = coalesce($3, subtitle),
         image_url = coalesce($4, image_url),
         sort_order = coalesce($5, sort_order),
         is_active = coalesce($6, is_active),
         updated_at = now()
     where id = $7
     returning id, eyebrow, title, subtitle, image_url as "imageUrl",
               sort_order as "sortOrder", is_active as "isActive"`,
    [data.eyebrow, data.title, data.subtitle, data.imageUrl, data.sortOrder, data.isActive, id]
  );
  return result.rows[0] || null;
}

export async function deleteHeroSlide(id) {
  const result = await query("delete from hero_slides where id = $1 returning id", [id]);
  return result.rowCount > 0;
}