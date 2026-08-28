import commentService from "../services/commentService.js";

export const createComment = async (req, res) => {
    try {
        // Strip client-supplied user or author details to prevent impersonation
        const { author, user, userId, ...commentData } = req.body;
        
        // Always assign the author from the authenticated user token
        commentData.author = req.user.id;

        const comment = await commentService.createComment(commentData);

        // Trigger notification for the post author
        try {
            await commentService.createCommentNotification(commentData.post, req.user.name);
        } catch (notifErr) {
            console.error("Failed to create comment notification:", notifErr.message);
        }

        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        console.log("Error in commentController.createComment:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const comments = await commentService.getAllComments(req.query);

        res.status(200).json({ message: "Comments retrieved successfully", comments });
    } catch (error) {
        console.log("Error in commentController.getAllComments:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await commentService.getCommentById(commentId);
        res.status(200).json({ message: "Comment retrieved successfully", comment });
    } catch (error) {
        console.log("Error in commentController.getCommentById:", error);
        res.status(400).json({ message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await commentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // Verify ownership (only author of comment or admin can update)
        if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to update this comment" });
        }

        const updatedComment = await commentService.updateComment(commentId, req.body);
        res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
        console.log("Error in commentController.updateComment:", error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await commentService.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // Verify ownership (only author of comment or admin can delete)
        if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        const deletedComment = await commentService.deleteComment(commentId);
        res.status(200).json({ message: "Comment deleted successfully", comment: deletedComment });
    } catch (error) {
        console.log("Error in commentController.deleteComment:", error);
        res.status(400).json({ message: error.message });
    }
};
