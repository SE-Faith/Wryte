import express from "express";
const router = express.Router();
import * as tagController from "../controllers/tagController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post('/', verifyToken, tagController.createTag);
router.get('/', tagController.getAllTags);
router.get('/:tagId', tagController.getTagById);
router.put('/:tagId', verifyToken, tagController.updateTag);
router.delete('/:tagId', verifyToken, tagController.deleteTag);

export default router;