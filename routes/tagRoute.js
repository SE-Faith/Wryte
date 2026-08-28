import express from "express";
const router = express.Router();
import * as tagController from "../controllers/tagController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/roleMiddleware.js";

router.post('/', verifyToken, authorizeRole(["admin"]), tagController.createTag);
router.get('/', tagController.getAllTags);
router.get('/:tagId', tagController.getTagById);
router.put('/:tagId', verifyToken, authorizeRole(["admin"]), tagController.updateTag);
router.delete('/:tagId', verifyToken, authorizeRole(["admin"]), tagController.deleteTag);

export default router;