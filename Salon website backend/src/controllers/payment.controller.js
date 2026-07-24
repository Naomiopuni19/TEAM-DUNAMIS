import crypto from "node:crypto";
import { z } from "zod";
import {
  createPayment,
  findPaymentAmount,
  findPaymentByReference,
  updatePaymentStatus
} from "../models/payment.model.js";
import { notFound } from "../utils/httpError.js";

const initiateSchema = z.object({
  type: z.enum(["booking", "order"]),
  refId: z.string().uuid(),
  momoNumber: z.string().min(7).max(20)
});

export async function initiate(req, res) {
  const body = initiateSchema.parse(req.body);
  const amount = await findPaymentAmount(body.type, body.refId, req.user.id);
  if (amount === null) throw notFound(`${body.type} not found`);

  const payment = await createPayment({
    reference: `MOMO-${crypto.randomUUID()}`,
    userId: req.user.id,
    type: body.type,
    refId: body.refId,
    momoNumber: body.momoNumber,
    amount
  });
  res.status(201).json(payment);
}

export async function webhook(req, res) {
  const body = z
    .object({
      reference: z.string(),
      status: z.enum(["pending", "success", "failed"])
    })
    .parse(req.body);
  await updatePaymentStatus(body.reference, body.status);
  res.json({ received: true });
}

export async function show(req, res) {
  const payment = await findPaymentByReference(req.params.reference, req.user.id);
  if (!payment) throw notFound("Payment not found");
  res.json(payment);
}
