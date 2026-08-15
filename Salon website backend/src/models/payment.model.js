import { query } from "../config/db.js";

export async function findPaymentAmount(type, refId, userId) {
  if (type === "order") {
    const result = await query(
      "select total_amount as amount from orders where id = $1 and user_id = $2",
      [refId, userId]
    );
    return result.rows[0]?.amount ?? null;
  }

  if (type === "gift_card") {
    const result = await query(
      "select amount from gift_cards where id = $1 and status = 'pending'",
      [refId]
    );
    return result.rows[0]?.amount ?? null;
  }

  const result = await query(
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

export async function getGiftCardForEmail(id) {
  const result = await query(
    `select id, code, amount, purchaser_name as "purchaserName", purchaser_email as "purchaserEmail",
            recipient_name as "recipientName", recipient_email as "recipientEmail", message
     from gift_cards
     where id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function getOrderDetailsForEmail(orderId) {
  const orderResult = await query(
    `select o.id, o.total_amount as "totalAmount", o.delivery_email as "deliveryEmail",
            u.name as "customerName", u.phone as "customerPhone", u.email as "customerEmail"
     from orders o
     join users u on u.id = o.user_id
     where o.id = $1`,
    [orderId]
  );
  const order = orderResult.rows[0];
  if (!order) return null;
  order.customerEmail = order.deliveryEmail || order.customerEmail;

  const itemsResult = await query(
    `select oi.quantity, oi.unit_price as "unitPrice", p.name
     from order_items oi
     join products p on p.id = oi.product_id
     where oi.order_id = $1`,
    [orderId]
  );
  order.items = itemsResult.rows;
  return order;
}

export async function getBookingDetailsForEmail(bookingId) {
  const result = await query(
    `select b.id, b.booking_date as date, b.time_slot as "timeSlot",
            b.confirmation_code as "confirmationCode", b.status,
            s.name as "serviceName", s.price_min as "priceMin", s.price_max as "priceMax",
            u.name as "customerName", u.phone as "customerPhone", u.email as "customerEmail"
     from bookings b
     join services s on s.id = b.service_id
     join users u on u.id = b.user_id
     where b.id = $1`,
    [bookingId]
  );
  return result.rows[0] || null;
}

export async function markPaymentSuccessAndUnlock(reference) {
  const result = await query(
    `update payments set status = 'success', updated_at = now()
     where reference = $1
     returning reference, payment_type as type, ref_id as "refId", amount`,
    [reference]
  );
  const payment = result.rows[0];
  if (!payment) return null;

  if (payment.type === "order") {
    await query("update orders set status = 'paid' where id = $1", [payment.refId]);
  } else if (payment.type === "gift_card") {
    await query("update gift_cards set status = 'active', updated_at = now() where id = $1", [payment.refId]);
  } else {
    await query("update bookings set status = 'confirmed' where id = $1", [payment.refId]);
  }

  return payment;
}