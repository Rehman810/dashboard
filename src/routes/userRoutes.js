import express from "express";
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddlerware.js";
import restrictTo from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.use(restrictTo("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
