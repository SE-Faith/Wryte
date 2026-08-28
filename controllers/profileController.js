import profileService from "../services/profileService.js";
import adminService from "../services/adminService.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;
        const user = await profileService.updateProfile(userId, profileData);
        res.status(200).json({ message: "Profile updated successfully"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await adminService.getProfile(userId);
        res.status(200).json({ message: "Profile retrieved successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await adminService.deactivateAccount(userId);
        res.status(200).json({ message: "Account deactivated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const activateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await adminService.activateAccount(userId);
        res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await adminService.deleteAccount(userId);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await adminService.getProfile(userId);
        res.status(200).json({ message: "Public profile retrieved successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

