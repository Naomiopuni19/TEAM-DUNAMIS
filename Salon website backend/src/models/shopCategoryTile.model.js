import { query } from "../config/db.js";

export async function listActiveTiles() {
  const result = await query(
    `select id, title, label, copy, image_url as "imageUrl", href, sort_order as "sortOrder"
     from shop_category_tiles
     where is_active = true
     order by sort_order asc`
  );
  return result.rows;
}

export async function listAllTiles() {
  const result = await query(
    `select id, title, label, copy, image_url as "imageUrl", href,
            sort_order as "sortOrder", is_active as "isActive"
     from shop_category_tiles
     order by sort_order asc`
  );
  return result.rows;
}

export async function createTile(data) {
  const result = await query(
    `insert into shop_category_tiles (title, label, copy, image_url, href, sort_order)
     values ($1, $2, $3, $4, $5, $6)
     returning id, title, label, copy, image_url as "imageUrl", href,
               sort_order as "sortOrder", is_active as "isActive"`,
    [data.title, data.label, data.copy, data.imageUrl, data.href, data.sortOrder]
  );
  return result.rows[0];
}

export async function updateTile(id, data) {
  const result = await query(
    `update shop_category_tiles
     set title = coalesce($1, title),
         label = coalesce($2, label),
         copy = coalesce($3, copy),
         image_url = coalesce($4, image_url),
         href = coalesce($5, href),
         sort_order = coalesce($6, sort_order),
         is_active = coalesce($7, is_active),
         updated_at = now()
     where id = $8
     returning id, title, label, copy, image_url as "imageUrl", href,
               sort_order as "sortOrder", is_active as "isActive"`,
    [data.title, data.label, data.copy, data.imageUrl, data.href, data.sortOrder, data.isActive, id]
  );
  return result.rows[0] || null;
}

export async function deleteTile(id) {
  const result = await query("delete from shop_category_tiles where id = $1 returning id", [id]);
  return result.rowCount > 0;
}