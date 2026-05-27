const mongoose = require("mongoose");
const Category = require("../models/Category");

class CategoryService {
    constructor() {}

    // create category
    async createCategory(categoryData) {
        const category = new Category(categoryData);
        await category.save();
        return category;
    }

    // get all categories
    async getAllCategories() {
        const categories = await Category.find();
        return categories;
    }

    // get category by id
    async getCategoryById(categoryId) {
        const category = await Category.findById(categoryId);
        return category;
    }

    // update category
    async updateCategory(categoryId, categoryData) {
        const category = await Category.findById(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        category.name = categoryData.name || category.name;
        category.description = categoryData.description || category.description;
        await category.save();
        return category;
    }

    // delete category
    async deleteCategory(categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        await category.remove();
        return category;
    }
}

module.exports = new CategoryService();