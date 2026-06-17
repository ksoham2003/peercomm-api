import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { productValidators } from "../validators/product.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

// Create a product for the authenticated seller, accepting up to 5 images.
router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  productValidators,
  validate,
  createProduct,
);

router.get("/", getAllProducts);

// Authenticated seller inventory.
router.get("/my", authMiddleware, getMyProducts);

router.get("/:id", getSingleProduct);

// Update product details and optionally replace its images.
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  productValidators,
  validate,
  updateProduct,
);

// Delete a product by id; auth middleware ensures the requester is logged in.
router.delete("/:id", authMiddleware, deleteProduct);




export default router;
