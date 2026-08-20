import { Router } from "express";
import {
  adminIndex,
  create,
  index,
  remove,
  update
} from "../controllers/productVariant.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/:productId", asyncHandler(index));
router.get("/:productId/admin", requireAuth, requireAdmin, asyncHandler(adminIndex));
router.post("/", requireAuth, requireAdmin, asyncHandler(create));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(update));
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(remove));

export default router;