import express from "express";
const router = express.Router();
import * as tagController from "../controllers/tagController.js";

router.post('/', tagController.createTag);
router.get('/', tagController.getAllTags);
router.get('/:tagId', tagController.getTagById);
router.put('/:tagId', tagController.updateTag);
router.delete('/:tagId', tagController.deleteTag);

export default router;