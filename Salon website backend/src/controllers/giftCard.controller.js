import { z } from "zod";
import { createPendingGiftCard, findGiftCardByCode } from "../models/giftCard.model.js";
import { notFound } from "../utils/httpError.js";

const purchaseSchema = z.object({
  amount: z.number().positive().min(20),
  purchaserName: z.string().min(2),
  purchaserEmail: z.string().email(),
  recipientName: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  message: z.string().max(300).optional()
});

export async function purchase(req, res) {
  const body = purchaseSchema.parse(req.body);
  const giftCard = await createPendingGiftCard(body);
  res.status(201).json({ giftCard });
}

export async function checkCode(req, res) {
  const giftCard = await findGiftCardByCode(req.params.code);
  if (!giftCard || giftCard.status !== "active") {
    throw notFound("No active gift card found with that code");
  }
  res.json({ giftCard });
}