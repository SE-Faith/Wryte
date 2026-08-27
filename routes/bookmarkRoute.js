import express from "express";
const router = express.Router();
import * as bookmarkController from "../controllers/bookmarkController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/post/:postId", verifyToken, bookmarkController.bookmarkPost);
router.delete("/post/:postId", verifyToken, bookmarkController.unbookmarkPost);
router.get("/user/:userId", verifyToken, bookmarkController.getBookmarksByUser);

export default router;
