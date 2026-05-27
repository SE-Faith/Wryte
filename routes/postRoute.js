import express from "express";
const router = express.Router();
import * as postController from "../controllers/postController.js";

router.post("/create", postController.createPost);
router.get("/all", postController.getPosts);
router.get("/:postId", postController.getPostById);
router.put("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

export default router;