import { z } from "zod";
import {
  createOrder,
  listOrders,
  listOrdersForUser,
  updateOrderStatus
} from "../models/order.model.js";
import { notFound } from "../utils/httpError.js";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive()
      })
    )
    .min(1),
  delivery: z.object({
    name: z.string().min(2),
    phone: z.string().min(7).max(20),
    address: z.string().min(5),
    notes: z.string().optional(),
    email: z.string().email().optional()
  }),
  giftCardCode: z.string().optional()
});

export async function create(req, res) {
  const body = orderSchema.parse(req.body);
  const result = await createOrder(req.user.id, body.items, body.delivery, body.giftCardCode);
  res.status(201).json(result);
}

export async function mine(req, res) {
  res.json(await listOrdersForUser(req.user.id));
}

export async function index(req, res) {
  const { status } = z.object({ status: z.string().optional() }).parse(req.query);
  res.json(await listOrders(status));
}

export async function updateStatus(req, res) {
  const body = z.object({
    status: z.enum(["pending_payment", "paid", "preparing", "out_for_delivery", "fulfilled", "cancelled"])
  }).parse(req.body);
  const order = await updateOrderStatus(req.params.id, body.status);
  if (!order) throw notFound("Order not found");
  res.json({ order });
}