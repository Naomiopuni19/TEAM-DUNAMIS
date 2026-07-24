import { query } from "../config/db.js";

export async function findPaymentAmount(type, refId, userId) {
  const result =
    type === "order"
      ? await query(
          "select total_amount as amount from orders where id = $1 and user_id = $2",
          [refId, userId]
        )
      : await query(
          `select s.price_min as amount
           from bookings b
           join services s on s.id = b.service_id
           where b.id = $1 and b.user_id = $2`,
          [refId, userId]
        );
  return result.rows[0]?.amount ?? null;
}

export async function createPayment({
  reference,
  userId,
  type,
  refId,
  momoNumber,
  amount
}) {
  const result = await query(
    `insert into payments
       (reference, user_id, payment_type, ref_id, momo_number, amount, status)
     values ($1, $2, $3, $4, $5, $6, 'pending')
     returning reference as "paymentReference", amount, status`,
    [reference, userId, type, refId, momoNumber, amount]
  );
  return result.rows[0];
}

export async function updatePaymentStatus(reference, status) {
  await query(
    "update payments set status = $1, updated_at = now() where reference = $2",
    [status, reference]
  );
}

export async function findPaymentByReference(reference, userId) {
  const result = await query(
    `select reference, status, amount, payment_type as type, ref_id as "refId",
            created_at as "createdAt"
     from payments
     where reference = $1 and user_id = $2`,
    [reference, userId]
  );
  return result.rows[0] || null;
}
