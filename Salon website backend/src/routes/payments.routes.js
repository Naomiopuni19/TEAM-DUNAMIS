import { Router } from "express";
import {
  initiate,
  show,
  webhook
} from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/initiate", requireAuth, asyncHandler(initiate));
router.post("/webhook", asyncHandler(webhook));
router.get("/:reference", requireAuth, asyncHandler(show));

export default router;
