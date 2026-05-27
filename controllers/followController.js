import followService from "../services/followService.js";

export const followUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const { userId: targetId } = req.params;

        const result = await followService.followUser(followerId, targetId);
        res.status(200).json({
            success: true,
            message: "Successfully followed user",
            data: {
                followingCount: result.follower.following.length,
                followersCount: result.target.followers.length
            }
        });
    } catch (error) {
        console.error("Error in followController.followUser:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const { userId: targetId } = req.params;

        const result = await followService.unfollowUser(followerId, targetId);
        res.status(200).json({
            success: true,
            message: "Successfully unfollowed user",
            data: {
                followingCount: result.follower.following.length,
                followersCount: result.target.followers.length
            }
        });
    } catch (error) {
        console.error("Error in followController.unfollowUser:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const followers = await followService.getFollowers(userId || req.user.id);
        res.status(200).json({
            success: true,
            message: "Followers retrieved successfully",
            followers
        });
    } catch (error) {
        console.error("Error in followController.getFollowers:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const following = await followService.getFollowing(userId || req.user.id);
        res.status(200).json({
            success: true,
            message: "Following list retrieved successfully",
            following
        });
    } catch (error) {
        console.error("Error in followController.getFollowing:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
