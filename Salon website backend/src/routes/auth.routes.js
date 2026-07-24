import { Router } from "express";
import {
  changePassword,
  login,
  me,
  register,
  updateProfile
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(me));
router.put("/me", requireAuth, asyncHandler(updateProfile));
router.put("/password", requireAuth, asyncHandler(changePassword));

export default router;
