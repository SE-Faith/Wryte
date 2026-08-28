import adminService from "../services/adminService.js";

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await adminService.getUser(userId);
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await adminService.suspendUser(userId);
        res.status(200).json({ message: "User suspended successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await adminService.banUser(userId);
        res.status(200).json({ message: "User banned successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
