import { pool, query } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";

function generateConfirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function availabilityWithClient(client, serviceId, date) {
  const result = await client.query(
    `select s.id as service_id, c.id as category_id, c.daily_cap,
            count(b.id)::int as booked_count
     from services s
     join service_categories c on c.id = s.category_id
     left join services category_service on category_service.category_id = c.id
       and category_service.is_active = true
     left join bookings b on b.service_id = category_service.id
       and b.booking_date = $2
       and b.status in ('pending', 'confirmed')
     where s.id = $1 and s.is_active = true
     group by s.id, c.id, c.daily_cap`,
    [serviceId, date]
  );

  const row = result.rows[0];
  if (!row) throw new HttpError(404, "Service not found");

  const slotsRemaining = Math.max(row.daily_cap - row.booked_count, 0);
  return {
    date,
    serviceId,
    categoryId: row.category_id,
    dailyCap: row.daily_cap,
    bookedCount: row.booked_count,
    slotsRemaining,
    available: slotsRemaining > 0
  };
}

export function getBookingAvailability(serviceId, date) {
  return availabilityWithClient(pool, serviceId, date);
}

export async function createBooking(userId, input) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const availability = await availabilityWithClient(client, input.serviceId, input.date);
    if (!availability.available) {
      throw new HttpError(
        409,
        "Daily booking cap reached for this service category",
        availability
      );
    }

    const code = generateConfirmationCode();

    const result = await client.query(
      `insert into bookings (user_id, service_id, booking_date, time_slot, status, reference_image_url, length_label, confirmation_code)
       values ($1, $2, $3, $4, 'pending', $5, $6, $7)
       returning id, user_id as "userId", service_id as "serviceId",
                 booking_date as date, time_slot as "timeSlot", status,
                 reference_image_url as "referenceImageUrl", length_label as "lengthLabel",
                 confirmation_code as "confirmationCode",
                 created_at as "createdAt"`,
      [userId, input.serviceId, input.date, input.timeSlot, input.referenceImageUrl || null, input.lengthLabel || null, code]
    );
    await client.query("commit");
    return result.rows[0];
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function listBookingsForUser(userId) {
  const result = await query(
    `select b.id, b.booking_date as date, b.time_slot as "timeSlot", b.status,
            b.reference_image_url as "referenceImageUrl", b.length_label as "lengthLabel",
            b.confirmation_code as "confirmationCode",
            s.name as "serviceName", c.name as "categoryName"
     from bookings b
     join services s on s.id = b.service_id
     join service_categories c on c.id = s.category_id
     where b.user_id = $1
     order by b.booking_date desc, b.time_slot`,
    [userId]
  );
  return result.rows;
}

export async function listBookings({ date, categoryId }) {
  const result = await query(
    `select b.id, b.booking_date as date, b.time_slot as "timeSlot", b.status,
            b.reference_image_url as "referenceImageUrl", b.length_label as "lengthLabel",
            json_build_object('id', u.id, 'name', u.name, 'phone', u.phone) as "user",
            json_build_object('id', s.id, 'name', s.name) as "service",
            json_build_object('id', c.id, 'name', c.name) as "category"
     from bookings b
     join users u on u.id = b.user_id
     join services s on s.id = b.service_id
     join service_categories c on c.id = s.category_id
     where ($1::date is null or b.booking_date = $1::date)
       and ($2::uuid is null or c.id = $2::uuid)
     order by b.booking_date desc, b.time_slot`,
    [date || null, categoryId || null]
  );
  return result.rows;
}

export async function findBookingByCode(code) {
  const result = await query(
    `select b.id, b.booking_date as date, b.time_slot as "timeSlot", b.status,
            b.confirmation_code as "confirmationCode",
            u.name as "customerName", u.phone as "customerPhone",
            s.name as "serviceName"
     from bookings b
     join users u on u.id = b.user_id
     join services s on s.id = b.service_id
     where upper(b.confirmation_code) = upper($1)`,
    [code]
  );
  return result.rows[0] || null;
}

export async function updateBookingStatus(id, status) {
  const result = await query(
    `update bookings
     set status = $1, updated_at = now()
     where id = $2
     returning id, user_id as "userId", service_id as "serviceId",
               booking_date as date, time_slot as "timeSlot", status`,
    [status, id]
  );
  return result.rows[0] || null;
}

export async function rescheduleBooking(id, date, timeSlot) {
  const result = await query(
    `update bookings
     set booking_date = $1, time_slot = $2, updated_at = now()
     where id = $3
     returning id, user_id as "userId", service_id as "serviceId",
               booking_date as date, time_slot as "timeSlot", status`,
    [date, timeSlot, id]
  );
  return result.rows[0] || null;
}