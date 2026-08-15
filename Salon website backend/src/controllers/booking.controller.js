import { z } from "zod";
import {
  approveCustomLength,
  createBooking,
  findBookingByCode,
  getBookingAvailability,
  getMonthAvailability,
  listBookings,
  listBookingsForUser,
  rescheduleBooking,
  updateBookingStatus
} from "../models/booking.model.js";
import { getBookingDetailsForEmail } from "../models/payment.model.js";
import {
  sendAdminBookingNotification,
  sendBookingApproved,
  sendBookingCancelled,
  sendBookingReceived,
  sendBookingRescheduled
} from "../utils/email.js";
import { notFound } from "../utils/httpError.js";

const createBookingSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().date(),
  timeSlot: z.string().min(3).max(20),
  referenceImageUrl: z.string().optional(),
  lengthLabel: z.string().optional(),
  customLengthRequest: z.string().min(2).max(300).optional()
});

const approveCustomLengthSchema = z.object({
  price: z.number().positive()
});

const monthAvailabilitySchema = z.object({
  serviceId: z.string().uuid(),
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12)
});

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"])
});

const scheduleSchema = z.object({
  date: z.string().date(),
  timeSlot: z.string().min(3).max(20)
});

const codeSchema = z.object({
  code: z.string().min(4).max(10)
});

export async function availability(req, res) {
  const params = z
    .object({ serviceId: z.string().uuid(), date: z.string().date() })
    .parse(req.query);
  res.json(await getBookingAvailability(params.serviceId, params.date));
}

export async function create(req, res) {
  const booking = await createBooking(
    req.user.id,
    createBookingSchema.parse(req.body)
  );
  const details = await getBookingDetailsForEmail(booking.id);
  if (details) {
    sendBookingReceived(details);
    sendAdminBookingNotification(details);
  }
  res.status(201).json({ booking });
}

export async function mine(req, res) {
  res.json(await listBookingsForUser(req.user.id));
}

export async function index(req, res) {
  const filters = z
    .object({
      date: z.string().date().optional(),
      categoryId: z.string().uuid().optional()
    })
    .parse(req.query);
  res.json(await listBookings(filters));
}

export async function verifyCode(req, res) {
  const body = codeSchema.parse(req.body);
  const booking = await findBookingByCode(body.code);
  if (!booking) throw notFound("No appointment found with that code");
  res.json({ booking });
}

export async function updateStatus(req, res) {
  const body = statusSchema.parse(req.body);
  const booking = await updateBookingStatus(req.params.id, body.status);
  if (!booking) throw notFound("Booking not found");

  const details = await getBookingDetailsForEmail(booking.id);
  if (details) {
    if (body.status === "confirmed") sendBookingApproved(details);
    if (body.status === "cancelled") sendBookingCancelled(details);
  }

  res.json({ booking });
}

export async function reschedule(req, res) {
  const body = scheduleSchema.parse(req.body);
  const booking = await rescheduleBooking(req.params.id, body.date, body.timeSlot);
  if (!booking) throw notFound("Booking not found");

  const details = await getBookingDetailsForEmail(booking.id);
  if (details) sendBookingRescheduled(details);

  res.json({ booking });
}

export async function monthAvailability(req, res) {
  const params = monthAvailabilitySchema.parse(req.query);
  res.json(await getMonthAvailability(params.serviceId, params.year, params.month));
}

export async function approveCustomLengthRequest(req, res) {
  const body = approveCustomLengthSchema.parse(req.body);
  const booking = await approveCustomLength(req.params.id, body.price);
  if (!booking) throw notFound("Booking not found");
  res.json({ booking });
}