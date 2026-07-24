import { Router } from "express";
import { index, update } from "../controllers/category.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(index));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(update));

export default router;
