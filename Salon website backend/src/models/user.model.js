import { query } from "../config/db.js";

export async function createCustomer({ name, phone, passwordHash }) {
  const result = await query(
    `insert into users (name, phone, password_hash, role)
     values ($1, $2, $3, 'customer')
     returning id, name, phone, role`,
    [name, phone, passwordHash]
  );
  return result.rows[0];
}

export async function findUserByPhone(phone) {
  const result = await query("select * from users where phone = $1", [phone]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await query(
    "select id, name, phone, role, is_active as \"isActive\" from users where id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function findUserWithPasswordById(id) {
  const result = await query("select * from users where id = $1", [id]);
  return result.rows[0] || null;
}

export async function updateUserProfile(id, { name, phone }) {
  const result = await query(
    `update users
     set name = $1, phone = $2, updated_at = now()
     where id = $3
     returning id, name, phone, role`,
    [name, phone, id]
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
