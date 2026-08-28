import User from "../models/User.js";
import Notification from "../models/Notification.js";

class FollowService {
    // Follow a user
    async followUser(followerId, targetId) {
        if (followerId.toString() === targetId.toString()) {
            throw new Error("You cannot follow yourself");
        }

        const follower = await User.findById(followerId).select("-password");
        const target = await User.findById(targetId).select("-password");

        if (!follower || !target) {
            throw new Error("User not found");
        }

        // Check if already following
        if (follower.following.includes(targetId)) {
            throw new Error("You are already following this user");
        }

        // Add to following/followers arrays
        follower.following.push(targetId);
        target.followers.push(followerId);

        await follower.save();
        await target.save();

        // Trigger follow notification
        try {
            await Notification.create({
                user: targetId,
                type: "follow",
                message: `${follower.name} started following you`
            });
        } catch (error) {
            console.error("Failed to create follow notification:", error);
        }

        return { follower, target };
    }

    // Unfollow a user
    async unfollowUser(followerId, targetId) {
        const follower = await User.findById(followerId).select("-password");
        const target = await User.findById(targetId).select("-password");

        if (!follower || !target) {
            throw new Error("User not found");
        }

        // Check if not following
        if (!follower.following.includes(targetId)) {
            throw new Error("You are not following this user");
        }

        // Remove from arrays
        follower.following = follower.following.filter(id => id.toString() !== targetId.toString());
        target.followers = target.followers.filter(id => id.toString() !== followerId.toString());

        await follower.save();
        await target.save();

        return { follower, target };
    }

    // Get followers of a user
    async getFollowers(userId) {
        const user = await User.findById(userId).select("-password").populate("followers", "name email avatar displayName bio");
        if (!user) {
            throw new Error("User not found");
        }
        return user.followers;
    }

    // Get following of a user
    async getFollowing(userId) {
        const user = await User.findById(userId).select("-password").populate("following", "name email avatar displayName bio");
        if (!user) {
            throw new Error("User not found");
        }
        return user.following;
    }
}

export default new FollowService();
