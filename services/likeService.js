import Like from "../models/Likes.js";

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
}

export default new LikeService();
