import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { validateRegister, validateLogin } from "../middlewares/validationMiddleware.js";

router.post("/register", authLimiter, validateRegister, authController.register);
router.post("/login", authLimiter, validateLogin, authController.login);
router.post("/change-password", verifyToken, authController.changePassword);

export default router;
