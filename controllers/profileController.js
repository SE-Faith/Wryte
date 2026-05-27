const profileService = require("../services/profileService");

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;
        const user = await profileService.updateProfile(userId, profileData);
        res.status(200).json({ message: "Profile updated successfully"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await profileService.getProfile(userId);
        res.status(200).json({ message: "Profile retrieved successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await profileService.deactivateAccount(userId);
        res.status(200).json({ message: "Account deactivated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const activateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await profileService.activateAccount(userId);
        res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await profileService.deleteAccount(userId);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



module.exports = {
    updateProfile,
    getProfile,
    deactivateAccount,
    activateAccount,
    deleteAccount
};
