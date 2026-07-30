import { z } from "zod";
import {
  createBooking,
  getBookingAvailability,
  listBookings,
  listBookingsForUser,
  rescheduleBooking,
  updateBookingStatus
} from "../models/booking.model.js";
import { notFound } from "../utils/httpError.js";

const createBookingSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().date(),
  timeSlot: z.string().min(3).max(20),
  referenceImageUrl: z.string().optional(),
  lengthLabel: z.string().optional()
});

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"])
});

const scheduleSchema = z.object({
  date: z.string().date(),
  timeSlot: z.string().min(3).max(20)
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

export async function updateStatus(req, res) {
  const body = statusSchema.parse(req.body);
  const booking = await updateBookingStatus(req.params.id, body.status);
  if (!booking) throw notFound("Booking not found");
  res.json({ booking });
}

export async function reschedule(req, res) {
  const body = scheduleSchema.parse(req.body);
  const booking = await rescheduleBooking(req.params.id, body.date, body.timeSlot);
  if (!booking) throw notFound("Booking not found");
  res.json({ booking });
}