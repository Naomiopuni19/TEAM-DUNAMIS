import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set in the environment`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  momoApiKey: process.env.MOMO_API_KEY || "",
  momoApiSecret: process.env.MOMO_API_SECRET || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  adminEmail: process.env.ADMIN_EMAIL || "",
  gmailUser: process.env.GMAIL_USER || "",
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || ""
};