import { Router } from "express";
import {
  create,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
} from "../controllers/prouduct.controllers";
import { protect, restrictTo } from "../middleware/auth.middelvware";
import { validate } from "../middleware/validate.middleware";
import { ProductZodSchema } from "../models/product.model";

const router = Router();

router.get("/", getProduct);

router.get("/:id", getProductById);

router.post(
  "/",
  validate(ProductZodSchema),
  restrictTo("admin"),
  protect,
  create,
);

router.put("/:id", restrictTo("admin"), protect, updateProduct);

router.delete("/:id", restrictTo("admin"), protect, deleteProduct);

export default router;
