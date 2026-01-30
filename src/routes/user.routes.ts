import { Router } from "express";
import {
  create,
  deleteUser,
  getUser,
  getUserById,
  updateUser,
} from "../controllers/user.controllers";
import { validate } from "../middleware/validate.middleware";
import { userZodSchema } from "../models/user.model";
import { protect, restrictTo } from "../middleware/auth.middelvware";

const router = Router();

router.get("/", protect, restrictTo("admin"), getUser);

router.get("/:id", protect, getUserById);

router.post("/", validate(userZodSchema), create);

router.patch("/:id", protect, restrictTo("admin"), updateUser);

router.delete("/:id", protect, restrictTo("admin"), deleteUser);

export default router;
