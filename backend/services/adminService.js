import User from "../models/User.js";
import { invalidateCache } from "../config/redis.js";

class AdminService {
    constructor() {}

     async getProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

    async incrementProfileViewsAndGet(userId) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { profileViews: 1 } },
            { new: true }
        ).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    };


    async deactivateAccount(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    user.isActive = false;
    await user.save();
    await invalidateCache("people-search:*");
    return user;
};

// reactivate account
async activateAccount(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    user.isActive = true;
    await user.save();
    await invalidateCache("people-search:*");
    return user;
};


    async deleteAccount(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    await user.deleteOne();
    await invalidateCache("people-search:*");
    return user;
};

    async getUser(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

    async getAllUsers() {
    const users = await User.find().select("-password");
    return users;
};

    async suspendUser(userId) {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        user.isSuspended = true;
        await user.save();
        return user;
    };

    async unsuspendUser(userId) {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        user.isSuspended = false;
        await user.save();
        return user;
    };

    async banUser(userId) {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        user.isBanned = true;
        await user.save();
        await invalidateCache("people-search:*");
        return user;
    };

    async unbanUser(userId) {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        user.isBanned = false;
        await user.save();
        await invalidateCache("people-search:*");
        return user;
    };

    async updateRole(userId, role) {
        if (!["admin", "user"].includes(role)) {
            throw new Error("Invalid role specified");
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        user.role = role;
        await user.save();
        return user;
    };
}

export default new AdminService();