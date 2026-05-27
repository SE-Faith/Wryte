import Notification from "../models/Notification.js";

class NotificationService{
    async createNotification(user,type,message){
        const notification = await Notification.create({user,type,message});
        return notification;
    }

    async getNotificationsByUser(userId){
        const notifications = await Notification.find({user:userId}).sort({createdAt:-1});
        return notifications;
    }

    async deleteNotification(notificationId){
        const notification = await Notification.findByIdAndDelete(notificationId);
        return notification;
    }
}

export default new NotificationService();