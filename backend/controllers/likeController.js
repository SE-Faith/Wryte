import likeService from "../services/likeService.js";

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const like = await likeService.likePost(req.user._id, postId);

        // Trigger notification for the post author
        try {
            await likeService.createLikeNotification(postId, req.user.name);
        } catch (notifErr) {
            console.error("Failed to create like notification:", notifErr.message);
        }

        res.status(200).json({ message: "Post liked successfully", like });
    } catch (error) {
        console.log("Error in likeController.likePost:", error);
        res.status(400).json({ message: error.message });
    }
};

export const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const like = await likeService.unlikePost(req.user._id, postId);
        res.status(200).json({ message: "Post unliked successfully", like });
    } catch (error) {
        console.log("Error in likeController.unlikePost:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getLikesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const likes = await likeService.getLikesByUser(userId);
        res.status(200).json({ message: "Likes retrieved successfully", likes });
    } catch (error) {
        console.log("Error in likeController.getLikesByUser:", error);
        res.status(400).json({ message: error.message });
    }
};
