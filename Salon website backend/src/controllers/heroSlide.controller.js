import { z } from "zod";
import {
  createHeroSlide,
  deleteHeroSlide,
  listActiveHeroSlides,
  listAllHeroSlides,
  updateHeroSlide
} from "../models/heroSlide.model.js";
import { notFound } from "../utils/httpError.js";

const createSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string().min(2),
  subtitle: z.string().default(""),
  imageUrl: z.string().min(4),
  sortOrder: z.number().int().default(0)
});

const updateSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(2).optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(4).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});

export async function index(_req, res) {
  res.json(await listActiveHeroSlides());
}

export async function adminIndex(_req, res) {
  res.json(await listAllHeroSlides());
}

export async function create(req, res) {
  const slide = await createHeroSlide(createSchema.parse(req.body));
  res.status(201).json({ slide });
}

export async function update(req, res) {
  const slide = await updateHeroSlide(req.params.id, updateSchema.parse(req.body));
  if (!slide) throw notFound("Hero slide not found");
  res.json({ slide });
}

export async function remove(req, res) {
  if (!(await deleteHeroSlide(req.params.id))) throw notFound("Hero slide not found");
  res.status(204).send();
}