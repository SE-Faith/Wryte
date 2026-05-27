const adminService = require("../services/adminService");

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await profileService.getUser(userId);
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await profileService.getAllUsers();
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await profileService.suspendUser(userId);
        res.status(200).json({ message: "User suspended successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await profileService.banUser(userId);
        res.status(200).json({ message: "User banned successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getUser,
    getAllUsers,
    suspendUser,
    banUser,
};




