import Like from "../models/Likes.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

class LikeService {
    async likePost(userId, postId) {
        const like = await Like.create({ user: userId, post: postId });
        return like;
    }

    async unlikePost(userId, postId) {
        const like = await Like.findOneAndDelete({ user: userId, post: postId });
        return like;
    }


    async getLikesByUser(userId) {
        const likes = await Like.find({ user: userId }).populate("post");
        return likes;
    }

    async createLikeNotification(postId){
        const post = await Post.findById(postId);
        if(!post){
            throw new Error("Post not found");
        }
        const notification = await Notification.create({user:post.user,type:"like",message:`${post.author.username} liked your post`});
        return notification;
    }   
}

export default new LikeService();
