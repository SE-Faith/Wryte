import express from "express";
const router = express.Router();
import * as adminController from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/roleMiddleware.js";

router.get("/user/:userId", verifyToken, authorizeRole(["admin"]), adminController.getUser);
router.get("/all", verifyToken, authorizeRole(["admin"]), adminController.getAllUsers);
router.put("/suspend/:userId", verifyToken, authorizeRole(["admin"]), adminController.suspendUser);
router.put("/ban/:userId", verifyToken, authorizeRole(["admin"]), adminController.banUser);

export default router;
