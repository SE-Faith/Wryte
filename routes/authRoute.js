import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/change-password", verifyToken, authController.changePassword);

export default router;
