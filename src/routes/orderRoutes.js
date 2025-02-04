import express from "express";
import {
  placeOrder,
  getOrders,
} from "../controllers/checkOutController.js";
import { authenticate } from "../middlewares/authMiddlerware.js";

const router = express.Router();

router.post("/", authenticate, placeOrder);
router.get("/", authenticate, getOrders);

export default router;
