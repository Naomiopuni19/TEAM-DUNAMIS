import { z } from "zod";
import {
  archiveService,
  createService,
  findServiceById,
  listServices,
  updateService
} from "../models/service.model.js";
import { notFound } from "../utils/httpError.js";

const imagePathSchema = z.string().refine(
  (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
  "Image must be a valid URL or local path"
);

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  categoryId: z.string().uuid(),
  durationMinutes: z.number().int().positive(),
  priceMin: z.number().nonnegative(),
  priceMax: z.number().nonnegative(),
  images: z.array(imagePathSchema).optional().default([])
});

export async function index(_req, res) {
  res.json(await listServices());
}

export async function show(req, res) {
  const service = await findServiceById(req.params.id);
  if (!service) throw notFound("Service not found");
  res.json(service);
}

export async function create(req, res) {
  const service = await createService(serviceSchema.parse(req.body));
  res.status(201).json({ service });
}

export async function update(req, res) {
  const service = await updateService(
    req.params.id,
    serviceSchema.partial().parse(req.body)
  );
  if (!service) throw notFound("Service not found");
  res.json({ service });
}

export async function remove(req, res) {
  if (!(await archiveService(req.params.id))) throw notFound("Service not found");
  res.status(204).send();
}
