import express from "express";
import {
  loginController,
  registerController,
  forgetPasswordController,
} from "../controllers/authController.js";

const router = express.Router();
// register user
router.post("/register", registerController);
// login user
router.post("/login", loginController);

// reset password
router.post("/forgot-password", forgetPasswordController);

export default router;
