import { z } from "zod";
import {
  createTile,
  deleteTile,
  listActiveTiles,
  listAllTiles,
  updateTile
} from "../models/shopCategoryTile.model.js";
import { notFound } from "../utils/httpError.js";

const createSchema = z.object({
  title: z.string().min(2),
  label: z.string().default(""),
  copy: z.string().default(""),
  imageUrl: z.string().min(4),
  href: z.string().default("#/shop"),
  sortOrder: z.number().int().default(0)
});

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  label: z.string().optional(),
  copy: z.string().optional(),
  imageUrl: z.string().min(4).optional(),
  href: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});

export async function index(_req, res) {
  res.json(await listActiveTiles());
}

export async function adminIndex(_req, res) {
  res.json(await listAllTiles());
}

export async function create(req, res) {
  const tile = await createTile(createSchema.parse(req.body));
  res.status(201).json({ tile });
}

export async function update(req, res) {
  const tile = await updateTile(req.params.id, updateSchema.parse(req.body));
  if (!tile) throw notFound("Category tile not found");
  res.json({ tile });
}

export async function remove(req, res) {
  if (!(await deleteTile(req.params.id))) throw notFound("Category tile not found");
  res.status(204).send();
}