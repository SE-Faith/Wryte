import express from "express";
const router = express.Router();
import * as likeController from "../controllers/likeController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/like", verifyToken, likeController.likePost);
router.post("/unlike", verifyToken, likeController.unlikePost);
router.get("/user/:userId", verifyToken, likeController.getLikesByUser);

export default router;