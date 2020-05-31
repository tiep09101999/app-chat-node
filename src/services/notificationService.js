import UserModel from "../models/user.model";
import ContactModel from '../models/contact.model';
import NotificationModel from "../models/notification.model";
import { resolve, reject } from "bluebird";

let getNotification = (userId, limit =10) =>{
    return new Promise( async (resolve,reject) => {
        try {
            let notifications = await NotificationModel.model.findByUserAndLimit(userId, limit);
            let notificationContent = notifications.map( async (e) => {
                let sender = await UserModel.findUserById(e.senderId);
                return NotificationModel.content.getContent(e.type, e.isRead, sender._id, sender.username, sender.avatar);
            });
            resolve(await Promise.all(notificationContent));
        } catch (e) {
            reject(e);
        }
    })
};

// đếm các thông báo chưa đọc
let countNotifUnread = (userId) =>{
    return new Promise( async (resolve,reject) => {
        try {
           let notificationsUnread = await NotificationModel.model.countNotifUnread(userId);
           resolve(notificationsUnread);
        } catch (e) {
            reject(e);
        }
    })
};


module.exports = {
    getNotification: getNotification,
    countNotifUnread: countNotifUnread
}