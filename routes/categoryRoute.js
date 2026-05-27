import express from "express";
const router = express.Router();
import * as categoryController from "../controllers/categoryController.js";

router.post("/create", categoryController.createCategory);
router.get("/all", categoryController.getAllCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.put("/:categoryId", categoryController.updateCategory);
router.delete("/:categoryId", categoryController.deleteCategory);

export default router;