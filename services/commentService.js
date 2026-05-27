import Comment from "../models/Comment.js";

class CommentService {
    constructor() {}

    // create comment
    async createComment(commentData) {
        const comment = new Comment(commentData);
        await comment.save();
        return comment;
    }

    // get all comments
    async getAllComments() {
        const comments = await Comment.find();
        return comments;
    }

    // get comment by id
    async getCommentById(commentId) {
        const comment = await Comment.findById(commentId);
        return comment;
    }

    // update comment
    async updateComment(commentId, commentData) {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }
        comment.content = commentData.content || comment.content;
        await comment.save();
        return comment;
    }

    // delete comment
    async deleteComment(commentId) {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }
        await comment.remove();
        return comment;
    }
}

export default new CommentService();