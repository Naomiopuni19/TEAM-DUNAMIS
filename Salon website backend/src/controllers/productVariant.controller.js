import { z } from "zod";
import {
  createVariant,
  deleteVariant,
  listAllVariantsForProduct,
  listVariantsForProduct,
  updateVariant
} from "../models/productVariant.model.js";
import { notFound } from "../utils/httpError.js";

const createSchema = z.object({
  productId: z.string().uuid(),
  label: z.string().min(1).optional(),
  price: z.number().nonnegative(),
  stockQty: z.number().int().nonnegative(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
  option1Name: z.string().optional(),
  option1Value: z.string().optional(),
  option2Name: z.string().optional(),
  option2Value: z.string().optional()
});

const updateSchema = z.object({
  label: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  stockQty: z.number().int().nonnegative().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  option1Name: z.string().optional(),
  option1Value: z.string().optional(),
  option2Name: z.string().optional(),
  option2Value: z.string().optional()
});

export async function index(req, res) {
  res.json(await listVariantsForProduct(req.params.productId));
}

export async function adminIndex(req, res) {
  res.json(await listAllVariantsForProduct(req.params.productId));
}

export async function create(req, res) {
  const variant = await createVariant(createSchema.parse(req.body));
  res.status(201).json({ variant });
}

export async function update(req, res) {
  const variant = await updateVariant(req.params.id, updateSchema.parse(req.body));
  if (!variant) throw notFound("Variant not found");
  res.json({ variant });
}

export async function remove(req, res) {
  if (!(await deleteVariant(req.params.id))) throw notFound("Variant not found");
  res.status(204).send();
}