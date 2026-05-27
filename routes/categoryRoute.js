const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/create", categoryController.createCategory);
router.get("/all", categoryController.getAllCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.put("/:categoryId", categoryController.updateCategory);
router.delete("/:categoryId", categoryController.deleteCategory);

module.exports = router;