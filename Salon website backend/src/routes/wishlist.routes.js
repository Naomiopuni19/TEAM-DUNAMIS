import { Router } from "express";
import { add, ids, index, remove } from "../controllers/wishlist.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(index));
router.get("/ids", requireAuth, asyncHandler(ids));
router.post("/", requireAuth, asyncHandler(add));
router.delete("/:productId", requireAuth, asyncHandler(remove));

export default router;