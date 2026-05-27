const commentService = require("../services/commentService");

const createComment = async (req, res) => {
    try {
        const comment = await commentService.createComment(req.body);
        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        console.log("Error in commentController.createComment:", error);
        res.status(400).json({ message: error.message });
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await commentService.getAllComments();
        res.status(200).json({ message: "Comments retrieved successfully", comments });
    } catch (error) {
        console.log("Error in commentController.getAllComments:", error);
        res.status(400).json({ message: error.message });
    }
};

const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await commentService.getCommentById(commentId);
        res.status(200).json({ message: "Comment retrieved successfully", comment });
    } catch (error) {
        console.log("Error in commentController.getCommentById:", error);
        res.status(400).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await commentService.updateComment(commentId, req.body);
        res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        console.log("Error in commentController.updateComment:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await commentService.deleteComment(commentId);
        res.status(200).json({ message: "Comment deleted successfully", comment });
    } catch (error) {
        console.log("Error in commentController.deleteComment:", error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment
};
