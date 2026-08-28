import ViewHistory from "../models/ViewHistory.js";
import Like from "../models/Likes.js";
import Post from "../models/Post.js";

class HistoryService {
    // Log a post view in user history (with upsert)
    async logPostView(userId, postId) {
        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }

        // Upsert view history: unique compound key ensures one record per user/post.
        // If it exists, update `viewedAt` so it rises to the top of the history list.
        const historyRecord = await ViewHistory.findOneAndUpdate(
            { user: userId, post: postId },
            { viewedAt: new Date() },
            { new: true, upsert: true }
        );

        return historyRecord;
    }

    // Get viewed posts history sorted by most recent
    async getViewHistory(userId) {
        const history = await ViewHistory.find({ user: userId })
            .sort({ viewedAt: -1 })
            .populate({
                path: "post",
                populate: [
                    { path: "author", select: "name avatar displayName" },
                    { path: "category", select: "name description" }
                ]
            });

        // Map and filter out records where the post might have been deleted
        return history.filter(item => item.post !== null);
    }

    // Get liked posts history sorted by most recent
    async getLikedHistory(userId) {
        const likes = await Like.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "post",
                populate: [
                    { path: "author", select: "name avatar displayName" },
                    { path: "category", select: "name description" }
                ]
            });

        // Filter out records where the post might have been deleted
        return likes.filter(item => item.post !== null);
    }
}

export default new HistoryService();
