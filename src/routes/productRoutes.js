import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddlerware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteProduct
);

export default router;
