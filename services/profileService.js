const User = require("../models/User");

class ProfileService {
    constructor() {}

    // update profile
    async updateProfile(userId, profileData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        user.avatar = profileData.avatar || user.avatar;
        user.displayName = profileData.displayName || user.displayName;
        user.bio = profileData.bio || user.bio;
        user.socialLinks = profileData.socialLinks || user.socialLinks;
        await user.save();
        
        return;
    }

   
}

module.exports = new ProfileService();