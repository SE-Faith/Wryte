import express from "express";
import { subscribe, getAllSubscribers, deleteSubscriber } from "../controllers/newsletterController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/admin/subscribers", verifyToken, authorizeRole(["admin"]), getAllSubscribers);
router.delete("/admin/subscribers/:subscriberId", verifyToken, authorizeRole(["admin"]), deleteSubscriber);

export default router;
