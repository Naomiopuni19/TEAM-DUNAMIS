import { z } from "zod";
import {
  addToWishlist,
  listWishlist,
  listWishlistedIds,
  removeFromWishlist
} from "../models/wishlist.model.js";

const productIdSchema = z.object({ productId: z.string().uuid() });

export async function index(req, res) {
  res.json(await listWishlist(req.user.id));
}

export async function ids(req, res) {
  res.json(await listWishlistedIds(req.user.id));
}

export async function add(req, res) {
  const body = productIdSchema.parse(req.body);
  await addToWishlist(req.user.id, body.productId);
  res.status(201).json({ ok: true });
}

export async function remove(req, res) {
  await removeFromWishlist(req.user.id, req.params.productId);
  res.status(204).send();
}