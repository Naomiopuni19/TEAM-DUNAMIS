import { Router } from "express";
import {
  availability,
  create,
  index,
  mine,
  reschedule,
  updateStatus
} from "../controllers/booking.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/availability", asyncHandler(availability));
router.post("/", requireAuth, asyncHandler(create));
router.get("/me", requireAuth, asyncHandler(mine));
router.get("/", requireAuth, requireAdmin, asyncHandler(index));
router.put(
  "/:id/status",
  requireAuth,
  requireAdmin,
  asyncHandler(updateStatus)
);
router.put(
  "/:id/schedule",
  requireAuth,
  requireAdmin,
  asyncHandler(reschedule)
);

export default router;
