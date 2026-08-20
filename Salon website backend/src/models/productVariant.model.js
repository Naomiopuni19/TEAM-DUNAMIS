import { query } from "../config/db.js";

export async function listVariantsForProduct(productId) {
  const result = await query(
    `select id, product_id as "productId", label, price, stock_qty as "stockQty",
            image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive"
     from product_variants
     where product_id = $1 and is_active = true
     order by sort_order asc`,
    [productId]
  );
  return result.rows;
}

export async function listAllVariantsForProduct(productId) {
  const result = await query(
    `select id, product_id as "productId", label, price, stock_qty as "stockQty",
            image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive"
     from product_variants
     where product_id = $1
     order by sort_order asc`,
    [productId]
  );
  return result.rows;
}

export async function createVariant(data) {
  const result = await query(
    `insert into product_variants (product_id, label, price, stock_qty, image_url, sort_order)
     values ($1, $2, $3, $4, $5, $6)
     returning id, product_id as "productId", label, price, stock_qty as "stockQty",
               image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive"`,
    [data.productId, data.label, data.price, data.stockQty, data.imageUrl || null, data.sortOrder || 0]
  );
  return result.rows[0];
}

export async function updateVariant(id, data) {
  const result = await query(
    `update product_variants
     set label = coalesce($1, label),
         price = coalesce($2, price),
         stock_qty = coalesce($3, stock_qty),
         image_url = coalesce($4, image_url),
         sort_order = coalesce($5, sort_order),
         is_active = coalesce($6, is_active),
         updated_at = now()
     where id = $7
     returning id, product_id as "productId", label, price, stock_qty as "stockQty",
               image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive"`,
    [data.label, data.price, data.stockQty, data.imageUrl, data.sortOrder, data.isActive, id]
  );
  return result.rows[0] || null;
}

export async function deleteVariant(id) {
  const result = await query("delete from product_variants where id = $1 returning id", [id]);
  return result.rowCount > 0;
}