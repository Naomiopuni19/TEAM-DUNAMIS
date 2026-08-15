import { query } from "../config/db.js";

export async function createCustomer({ name, phone, passwordHash, email, area }) {
  const result = await query(
    `insert into users (name, phone, password_hash, role, email, area)
     values ($1, $2, $3, 'customer', $4, $5)
     returning id, name, phone, role, email, area`,
    [name, phone, passwordHash, email || null, area || null]
  );
  return result.rows[0];
}

export async function findUserByPhone(phone) {
  const result = await query("select * from users where phone = $1", [phone]);
  return result.rows[0] || null;
}

export async function findUserByEmail(email) {
  const result = await query("select * from users where lower(email) = lower($1)", [email]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await query(
    "select id, name, phone, role, email, area, is_active as \"isActive\" from users where id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function findUserWithPasswordById(id) {
  const result = await query("select * from users where id = $1", [id]);
  return result.rows[0] || null;
}

export async function updateUserProfile(id, { name, phone, email, area }) {
  const result = await query(
    `update users
     set name = $1, phone = $2, email = coalesce($3, email), area = coalesce($4, area), updated_at = now()
     where id = $5
     returning id, name, phone, role, email, area`,
    [name, phone, email || null, area || null, id]
  );
  return result.rows[0] || null;
}

export async function updateUserPassword(id, passwordHash) {
  const result = await query(
    `update users
     set password_hash = $1, updated_at = now()
     where id = $2
     returning id`,
    [passwordHash, id]
  );
  return Boolean(result.rowCount);
}