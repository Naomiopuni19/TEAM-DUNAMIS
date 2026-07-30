import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import {
  createCustomer,
  findUserById,
  findUserByPhone,
  findUserWithPasswordById,
  updateUserPassword,
  updateUserProfile
} from "../models/user.model.js";
import { HttpError, notFound } from "../utils/httpError.js";

const authSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(7).max(20),
  password: z.string().min(6),
  email: z.string().email(),
  area: z.string().max(120).optional()
});

const ghanaPhoneRegex = /^(0|\+233)[0-9]{9}$/;
const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(ghanaPhoneRegex, "Enter a valid Ghanaian phone number, e.g. 024 123 4567"),
  password: z.string().regex(strongPasswordRegex, "Password needs at least 8 characters, including a letter and a number"),
  email: z.string().email(),
  area: z.string().max(120).optional()
});

const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal("")),
  area: z.string().max(120).optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    email: user.email || null,
    area: user.area || null
  };
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: "2h"
  });
}

export async function register(req, res) {
  const body = registerSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await createCustomer({
    name: body.name,
    phone: body.phone,
    passwordHash,
    email: body.email,
    area: body.area || null
  });
  res.status(201).json({ user: publicUser(user), token: signToken(user) });
}

export async function login(req, res) {
  const body = authSchema.omit({ name: true, email: true, area: true }).parse(req.body);
  const user = await findUserByPhone(body.phone);
  if (!user || !(await bcrypt.compare(body.password, user.password_hash))) {
    throw new HttpError(401, "Invalid phone or password");
  }
  res.json({ user: publicUser(user), token: signToken(user) });
}

export async function me(req, res) {
  const user = await findUserById(req.user.id);
  if (!user) throw notFound("User not found");
  res.json({ user: publicUser(user) });
}

export async function updateProfile(req, res) {
  const user = await updateUserProfile(
    req.user.id,
    profileSchema.parse(req.body)
  );
  if (!user) throw notFound("User not found");
  res.json({ user: publicUser(user) });
}

export async function changePassword(req, res) {
  const body = passwordSchema.parse(req.body);
  const user = await findUserWithPasswordById(req.user.id);
  if (!user) throw notFound("User not found");
  if (!(await bcrypt.compare(body.currentPassword, user.password_hash))) {
    throw new HttpError(401, "Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(body.newPassword, 12);
  await updateUserPassword(user.id, passwordHash);
  res.json({ message: "Password updated successfully" });
}