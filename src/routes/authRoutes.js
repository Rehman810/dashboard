import express from "express";
import {
  register,
  login,
  createAdminHandler,
  verifyEmail,
  forgotPassword,
} from "../controllers/authController.js";
import upload from "../middlewares/multerMiddlerware.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  register
);
router.post("/login", login);
router.post("/create-admin", createAdminHandler);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

export default router;
