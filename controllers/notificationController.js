import notificationService from "../services/notificationService.js";   

export const createNotification = async (req, res) => {
    try {
        const user = req.user.id;   
        const { type, message } = req.body;
        const notification = await notificationService.createNotification(user, type, message);
        res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
        console.log("Error in notificationController.createNotification:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await notificationService.getNotificationsByUser(userId);
        res.status(200).json({ message: "Notifications retrieved successfully", notifications });
    } catch (error) {
        console.log("Error in notificationController.getUserNotifications:", error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notification = await notificationService.deleteNotification(notificationId);
        res.status(200).json({ message: "Notification deleted successfully", notification });
    } catch (error) {
        console.log("Error in notificationController.deleteNotification:", error);
        res.status(400).json({ message: error.message });
    }
};
