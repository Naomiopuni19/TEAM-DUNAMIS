import { z } from "zod";
import {
  createLengthOption,
  deleteLengthOption,
  listLengthOptions,
  updateLengthOption
} from "../models/serviceLengthOption.model.js";
import { notFound } from "../utils/httpError.js";

const createSchema = z.object({
  serviceId: z.string().min(1),
  label: z.string().min(2),
  priceMin: z.number().nonnegative(),
  priceMax: z.number().nonnegative(),
  sortOrder: z.number().int().default(0)
});

const updateSchema = z.object({
  label: z.string().min(2).optional(),
  priceMin: z.number().nonnegative().optional(),
  priceMax: z.number().nonnegative().optional(),
  sortOrder: z.number().int().optional()
});

export async function index(req, res) {
  res.json(await listLengthOptions(req.params.serviceId));
}

export async function create(req, res) {
  const option = await createLengthOption(createSchema.parse(req.body));
  res.status(201).json({ option });
}

export async function update(req, res) {
  const option = await updateLengthOption(req.params.id, updateSchema.parse(req.body));
  if (!option) throw notFound("Length option not found");
  res.json({ option });
}

export async function remove(req, res) {
  if (!(await deleteLengthOption(req.params.id))) throw notFound("Length option not found");
  res.status(204).send();
}