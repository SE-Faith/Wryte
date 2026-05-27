const tagService = require("../services/tagService");

const createTag = async (req, res) => {
    try {
        const tag = await tagService.createTag(req.body);
        res.status(201).json({ message: "Tag created successfully", tag });
    } catch (error) {
        console.log("Error in tagController.createTag:", error);
        res.status(400).json({ message: error.message });
    }
};

const getAllTags = async (req, res) => {
    try {
        const tags = await tagService.getAllTags();
        res.status(200).json({ message: "Tags retrieved successfully", tags });
    } catch (error) {
        console.log("Error in tagController.getAllTags:", error);
        res.status(400).json({ message: error.message });
    }
};

const getTagById = async (req, res) => {
    try {
        const { tagId } = req.params;
        const tag = await tagService.getTagById(tagId);
        res.status(200).json({ message: "Tag retrieved successfully", tag });
    } catch (error) {
        console.log("Error in tagController.getTagById:", error);
        res.status(400).json({ message: error.message });
    }
};

const updateTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const tag = await tagService.updateTag(tagId, req.body);
        res.status(200).json({ message: "Tag updated successfully", tag });
    } catch (error) {
        console.log("Error in tagController.updateTag:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const tag = await tagService.deleteTag(tagId);
        res.status(200).json({ message: "Tag deleted successfully", tag });
    } catch (error) {
        console.log("Error in tagController.deleteTag:", error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag
};
