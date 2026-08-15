import { query } from "../config/db.js";

function generateGiftCardCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "GIFT-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createPendingGiftCard(data) {
  const code = generateGiftCardCode();
  const result = await query(
    `insert into gift_cards
       (code, amount, balance, purchaser_name, purchaser_email, recipient_name, recipient_email, message, status)
     values ($1, $2, $2, $3, $4, $5, $6, $7, 'pending')
     returning id, code, amount, balance, purchaser_name as "purchaserName",
               purchaser_email as "purchaserEmail", recipient_name as "recipientName",
               recipient_email as "recipientEmail", message, status`,
    [
      code,
      data.amount,
      data.purchaserName,
      data.purchaserEmail,
      data.recipientName || null,
      data.recipientEmail || null,
      data.message || null
    ]
  );
  return result.rows[0];
}

export async function activateGiftCard(id) {
  const result = await query(
    `update gift_cards
     set status = 'active', updated_at = now()
     where id = $1 and status = 'pending'
     returning id, code, amount, balance, purchaser_name as "purchaserName",
               purchaser_email as "purchaserEmail", recipient_name as "recipientName",
               recipient_email as "recipientEmail", message, status`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findGiftCardById(id) {
  const result = await query(
    `select id, code, amount, balance, status from gift_cards where id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findGiftCardByCode(code) {
  const result = await query(
    `select id, code, amount, balance, status from gift_cards where upper(code) = upper($1)`,
    [code]
  );
  return result.rows[0] || null;
}

export async function deductGiftCardBalance(code, amountToDeduct) {
  const result = await query(
    `update gift_cards
     set balance = balance - $1,
         status = case when balance - $1 <= 0 then 'used' else status end,
         updated_at = now()
     where upper(code) = upper($2) and status = 'active' and balance >= $1
     returning id, code, balance, status`,
    [amountToDeduct, code]
  );
  return result.rows[0] || null;
}