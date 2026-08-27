import express from "express";
const router = express.Router();
import * as categoryController from "../controllers/categoryController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/create", verifyToken, categoryController.createCategory);
router.get("/all", categoryController.getAllCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.put("/:categoryId", verifyToken, categoryController.updateCategory);
router.delete("/:categoryId", verifyToken, categoryController.deleteCategory);

export default router;