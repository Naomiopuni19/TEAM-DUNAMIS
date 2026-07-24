import { z } from "zod";
import {
  listCategories,
  updateCategoryCap
} from "../models/category.model.js";
import { notFound } from "../utils/httpError.js";

const capSchema = z.object({ dailyCap: z.number().int().positive() });

export async function index(_req, res) {
  res.json(await listCategories());
}

export async function update(req, res) {
  const body = capSchema.parse(req.body);
  const category = await updateCategoryCap(req.params.id, body.dailyCap);
  if (!category) throw notFound("Category not found");
  res.json({ category });
}
