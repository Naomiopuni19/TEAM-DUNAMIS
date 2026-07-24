import { z } from "zod";
import {
  archiveProduct,
  createProduct,
  listProducts,
  updateProduct,
  updateProductStock
} from "../models/product.model.js";
import { notFound } from "../utils/httpError.js";

const imagePathSchema = z.string().refine(
  (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
  "Image must be a valid URL or local path"
);

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  category: z.string().min(2),
  price: z.number().nonnegative(),
  stockQty: z.number().int().nonnegative(),
  images: z.array(imagePathSchema).optional().default([])
});

const stockSchema = z.object({
  stockQty: z.number().int().nonnegative()
});

export async function index(_req, res) {
  res.json(await listProducts());
}

export async function create(req, res) {
  const product = await createProduct(productSchema.parse(req.body));
  res.status(201).json({ product });
}

export async function updateStock(req, res) {
  const body = stockSchema.parse(req.body);
  const product = await updateProductStock(req.params.id, body.stockQty);
  if (!product) throw notFound("Product not found");
  res.json({ product });
}

export async function update(req, res) {
  const product = await updateProduct(
    req.params.id,
    productSchema.partial().parse(req.body)
  );
  if (!product) throw notFound("Product not found");
  res.json({ product });
}

export async function remove(req, res) {
  if (!(await archiveProduct(req.params.id))) throw notFound("Product not found");
  res.status(204).send();
}
