import { query } from "../config/db.js";

export async function listVariantsForProduct(productId) {
  const result = await query(
    `select id, product_id as "productId", label, price, stock_qty as "stockQty",
            image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive",
            option1_name as "option1Name", option1_value as "option1Value",
            option2_name as "option2Name", option2_value as "option2Value"
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
            image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive",
            option1_name as "option1Name", option1_value as "option1Value",
            option2_name as "option2Name", option2_value as "option2Value"
     from product_variants
     where product_id = $1
     order by sort_order asc`,
    [productId]
  );
  return result.rows;
}

export async function createVariant(data) {
  const computedLabel = [data.option1Value, data.option2Value].filter(Boolean).join(", ") || data.label;
  const result = await query(
    `insert into product_variants
       (product_id, label, price, stock_qty, image_url, sort_order,
        option1_name, option1_value, option2_name, option2_value)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning id, product_id as "productId", label, price, stock_qty as "stockQty",
               image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive",
               option1_name as "option1Name", option1_value as "option1Value",
               option2_name as "option2Name", option2_value as "option2Value"`,
    [
      data.productId,
      computedLabel,
      data.price,
      data.stockQty,
      data.imageUrl || null,
      data.sortOrder || 0,
      data.option1Name || null,
      data.option1Value || null,
      data.option2Name || null,
      data.option2Value || null
    ]
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
         option1_name = coalesce($7, option1_name),
         option1_value = coalesce($8, option1_value),
         option2_name = coalesce($9, option2_name),
         option2_value = coalesce($10, option2_value),
         updated_at = now()
     where id = $11
     returning id, product_id as "productId", label, price, stock_qty as "stockQty",
               image_url as "imageUrl", sort_order as "sortOrder", is_active as "isActive",
               option1_name as "option1Name", option1_value as "option1Value",
               option2_name as "option2Name", option2_value as "option2Value"`,
    [
      data.label, data.price, data.stockQty, data.imageUrl, data.sortOrder, data.isActive,
      data.option1Name, data.option1Value, data.option2Name, data.option2Value, id
    ]
  );
  return result.rows[0] || null;
}

export async function deleteVariant(id) {
  const result = await query("delete from product_variants where id = $1 returning id", [id]);
  return result.rowCount > 0;
}