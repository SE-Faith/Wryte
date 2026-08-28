import express from "express";
const router = express.Router();
import * as categoryController from "../controllers/categoryController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/roleMiddleware.js";

router.post("/create", verifyToken, authorizeRole(["admin"]), categoryController.createCategory);
router.get("/all", categoryController.getAllCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.put("/:categoryId", verifyToken, authorizeRole(["admin"]), categoryController.updateCategory);
router.delete("/:categoryId", verifyToken, authorizeRole(["admin"]), categoryController.deleteCategory);

export default router;