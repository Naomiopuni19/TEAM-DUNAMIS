import crypto from "node:crypto";
import { env } from "../config/env.js";
import { z } from "zod";
import {
  createPayment,
  findPaymentAmount,
  findPaymentByReference,
  updatePaymentStatus,
  markPaymentSuccessAndUnlock,
  getOrderDetailsForEmail,
  getBookingDetailsForEmail
} from "../models/payment.model.js";
import { notFound } from "../utils/httpError.js";
import { sendOrderConfirmation, sendAdminOrderNotification } from "../utils/email.js";

const initiateSchema = z.object({
  type: z.enum(["booking", "order"]),
  refId: z.string().uuid(),
  momoNumber: z.string().min(7).max(20)
});

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export async function initiate(req, res) {
  const body = initiateSchema.parse(req.body);
  const amount = await findPaymentAmount(body.type, body.refId, req.user.id);
  if (amount === null) throw notFound(`${body.type} not found`);

  const reference = `SALON-${crypto.randomUUID()}`;

  await createPayment({
    reference,
    userId: req.user.id,
    type: body.type,
    refId: body.refId,
    momoNumber: body.momoNumber,
    amount
  });

  const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: `${req.user.phone}@customer.salon`,
      amount: Math.round(amount * 100),
      reference,
      callback_url: `${FRONTEND_URL}/#/payment-complete`
    })
  });

  const paystackData = await paystackResponse.json();

  if (!paystackData.status) {
    throw new Error(paystackData.message || "Could not start payment with Paystack");
  }

  res.status(201).json({
    paymentReference: reference,
    amount,
    status: "pending",
    authorizationUrl: paystackData.data.authorization_url
  });
}

export async function verify(req, res) {
  const reference = req.params.reference;

  const paystackResponse = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
  );
  const paystackData = await paystackResponse.json();

  if (paystackData.data?.status === "success") {
    const unlocked = await markPaymentSuccessAndUnlock(reference);
    if (!unlocked) throw notFound("Payment not found");

    if (unlocked.type === "order") {
      const order = await getOrderDetailsForEmail(unlocked.refId);
      if (order) {
        sendOrderConfirmation(order.customerEmail, order);
        sendAdminOrderNotification(order, {
          name: order.customerName,
          phone: order.customerPhone
        });
      }
    }

    res.json({ reference, status: "success", amount: unlocked.amount });
  } else {
    await updatePaymentStatus(reference, "failed");
    res.json({ reference, status: "failed" });
  }
}

export async function webhook(req, res) {
  const signature = req.headers["x-paystack-signature"];
  const expectedSignature = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(req.rawBody || "")
    .digest("hex");

  if (!signature || signature !== expectedSignature) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

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