import { query } from "../config/db.js";

export async function listWishlist(userId) {
  const result = await query(
    `select p.id, p.name, p.description, p.price, p.stock_qty as "stockQty",
            p.category, p.images, w.created_at as "addedAt"
     from wishlists w
     join products p on p.id = w.product_id
     where w.user_id = $1
     order by w.created_at desc`,
    [userId]
  );
  return result.rows;
}

export async function addToWishlist(userId, productId) {
  await query(
    `insert into wishlists (user_id, product_id) values ($1, $2)
     on conflict (user_id, product_id) do nothing`,
    [userId, productId]
  );
}

export async function removeFromWishlist(userId, productId) {
  await query(
    `delete from wishlists where user_id = $1 and product_id = $2`,
    [userId, productId]
  );
}

export async function listWishlistedIds(userId) {
  const result = await query(
    `select product_id as "productId" from wishlists where user_id = $1`,
    [userId]
  );
  return result.rows.map((row) => row.productId);
}