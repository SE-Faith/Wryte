import express from "express";
const router = express.Router();
import * as notificationController from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.get("/", verifyToken, notificationController.getUserNotifications);
router.post("/create", verifyToken, notificationController.createNotification);
router.delete("/:notificationId", verifyToken, notificationController.deleteNotification);

export default router;
