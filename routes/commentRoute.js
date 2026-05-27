import express from "express";
const router = express.Router();
import * as commentController from "../controllers/commentController.js";

router.post('/', commentController.createComment);
router.get('/', commentController.getAllComments);
router.get('/:commentId', commentController.getCommentById);
router.put('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

export default router;