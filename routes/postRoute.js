import express from "express";
const router = express.Router();
import * as postController from "../controllers/postController.js";
import { validatePost } from "../middlewares/validationMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/create", verifyToken, validatePost, postController.createPost);
router.get("/all", postController.getPosts);
router.get("/:postId", postController.getPostById);
router.put("/:postId", verifyToken, postController.updatePost);
router.delete("/:postId", verifyToken, postController.deletePost);

export default router;