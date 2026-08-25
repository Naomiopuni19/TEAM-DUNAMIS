import { query } from "../config/db.js";

export async function listProducts() {
  const result = await query(
    `select id, name, description, category, price::float8 as price, stock_qty as "stockQty",
            stock_qty > 0 as "inStock", images
     from products
     where is_active = true
     order by category, name`
  );
  return result.rows;
}

export async function createProduct(input) {
  const result = await query(
    `insert into products (name, description, category, price, stock_qty, images)
     values ($1, $2, $3, $4, $5, $6)
     returning id, name, description, category, price::float8 as price, stock_qty as "stockQty",
               stock_qty > 0 as "inStock", images`,
    [
      input.name,
      input.description,
      input.category,
      input.price,
      input.stockQty,
      input.images
    ]
  );
  return result.rows[0];
}

export async function updateProductStock(id, stockQty) {
  const result = await query(
    `update products
     set stock_qty = $1, updated_at = now()
     where id = $2
     returning id, name, description, category, price::float8 as price, stock_qty as "stockQty",
               stock_qty > 0 as "inStock", images`,
    [stockQty, id]
  );
  return result.rows[0] || null;
}

export async function updateProduct(id, input) {
  const current = await query("select * from products where id = $1", [id]);
  if (!current.rowCount) return null;
  const merged = { ...current.rows[0], ...input };
  const result = await query(
    `update products
     set name = $1, description = $2, category = $3, price = $4,
         stock_qty = $5, images = $6, updated_at = now()
     where id = $7
     returning id, name, description, category, price::float8 as price, stock_qty as "stockQty",
               stock_qty > 0 as "inStock", images`,
    [
      merged.name,
      merged.description,
      merged.category,
      merged.price,
      merged.stockQty ?? merged.stock_qty,
      merged.images,
      id
    ]
  );
  return result.rows[0];
}

export async function archiveProduct(id) {
  const result = await query(
    `update products set is_active = false, updated_at = now()
     where id = $1 and is_active = true returning id`,
    [id]
  );
  return Boolean(result.rowCount);
}