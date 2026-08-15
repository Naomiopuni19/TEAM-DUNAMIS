import bcrypt from "bcryptjs";
import { pool } from "../src/config/db.js";
import { env } from "../src/config/env.js";

const admin = {
  name: process.env.ADMIN_NAME,
  phone: process.env.ADMIN_PHONE,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD
};

async function createAdmin() {
  if (!admin.name || !admin.phone || !admin.email || !admin.password) {
    throw new Error("Set ADMIN_NAME, ADMIN_PHONE, ADMIN_EMAIL, and ADMIN_PASSWORD in .env before running this script.");
  }
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  const passwordHash = await bcrypt.hash(admin.password, 12);

  const result = await pool.query(
    `insert into users (name, phone, email, password_hash, role)
     values ($1, $2, $3, $4, 'admin')
     on conflict (phone) do update
       set name = excluded.name,
           email = excluded.email,
           password_hash = excluded.password_hash,
           role = 'admin',
           updated_at = now()
     returning id, name, phone, email, role`,
    [admin.name, admin.phone, admin.email, passwordHash]
  );

  await pool.end();
  console.log(`Admin ready: ${result.rows[0].name} (${result.rows[0].phone}) - ${result.rows[0].email}`);
}

createAdmin().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});