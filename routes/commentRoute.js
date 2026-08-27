import express from "express";
const router = express.Router();
import * as commentController from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post('/', verifyToken, commentController.createComment);
router.get('/', commentController.getAllComments);
router.get('/:commentId', commentController.getCommentById);
router.put('/:commentId', verifyToken, commentController.updateComment);
router.delete('/:commentId', verifyToken, commentController.deleteComment);

export default router;