import express from "express";
const router = express.Router();
import * as adminController from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/roleMiddleware.js";

router.get("/user/:userId", verifyToken, authorizeRole(["admin"]), adminController.getUser);
router.get("/all", verifyToken, authorizeRole(["admin"]), adminController.getAllUsers);
router.put("/suspend/:userId", verifyToken, authorizeRole(["admin"]), adminController.suspendUser);
router.put("/unsuspend/:userId", verifyToken, authorizeRole(["admin"]), adminController.unsuspendUser);
router.put("/ban/:userId", verifyToken, authorizeRole(["admin"]), adminController.banUser);
router.put("/unban/:userId", verifyToken, authorizeRole(["admin"]), adminController.unbanUser);
router.put("/role/:userId", verifyToken, authorizeRole(["admin"]), adminController.updateRole);
router.delete("/user/:userId", verifyToken, authorizeRole(["admin"]), adminController.deleteUser);

export default router;
