import User from "../models/User.js";

class AdminService {
    constructor() {}

     async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};


    async deactivateAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    user.isActive = false;
    await user.save();
    return user;
};

// reactivate account
async activateAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    user.isActive = true;
    await user.save();
    return user;
};


    async deleteAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    await user.deleteOne();
    return user;
};

    async getUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

    async getAllUsers() {
    const users = await User.find();
    return users;
};

    async suspendUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    user.isSuspended = true;
    await user.save();
    return user;
};

    async banUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    user.isBanned = true;
    await user.save();
    return user;
};
}

export default new AdminService();