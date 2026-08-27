import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

class CommentService {
    constructor() {}

    // create comment
    async createComment(commentData) {
        const comment = new Comment(commentData);
        await comment.save();
        return comment;
    }

    async getAllComments(queryParams = {}) {
        const filter = {};
        if (queryParams.postId) {
            filter.post = queryParams.postId;
        }
        const comments = await Comment.find(filter)
            .populate("author", "name displayName avatar")
            .sort({ createdAt: -1 });
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

    async createCommentNotification(postId){
        const post = await Post.findById(postId);
        if(!post){
            throw new Error("Post not found");
        }
        const notification = await Notification.create({user:post.user,type:"comment",message:`${post.author.username} commented on your post`});
        return notification;
    }
}

export default new CommentService();