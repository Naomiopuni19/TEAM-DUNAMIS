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
    .min(1)
});

export async function create(req, res) {
  const result = await createOrder(req.user.id, orderSchema.parse(req.body).items);
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
    status: z.enum(["pending_payment", "paid", "cancelled", "fulfilled"])
  }).parse(req.body);
  const order = await updateOrderStatus(req.params.id, body.status);
  if (!order) throw notFound("Order not found");
  res.json({ order });
}
