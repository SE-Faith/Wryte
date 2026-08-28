import categoryService from "../services/categoryService.js";

export const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ message: "Categories retrieved successfully", categories });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await categoryService.getCategoryById(categoryId);
        res.status(200).json({ message: "Category retrieved successfully", category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await categoryService.updateCategory(categoryId, req.body);
        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await categoryService.deleteCategory(categoryId);
        res.status(200).json({ message: "Category deleted successfully", category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};