import { Router } from "express";
import { checkCode, purchase } from "../controllers/giftCard.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", requireAuth, asyncHandler(purchase));
router.get("/:code", asyncHandler(checkCode));

export default router;