import mongoose from "mongoose"
let Schema = mongoose.Schema;
let NotificationSchema =  new Schema({
    senderId: String,
    receiverId: String,
    type: String,
    content: String,
    isRead: {type: Boolean, default:false},
    createAt: {type:String, default: Date.now}
   
})

NotificationSchema.statics= {
    createNew(item){
        return this.create(item);
    },
    removeReqContactNotification(senderId, receiverId, type) {
        return this.deleteOne({
            $and: [
                {"senderId": senderId},
                {"receiverId": receiverId},
                {"type": type}
            ]
        }).exec();
    },
    findByUserAndLimit(receiverId, limit){
        return this.find({"receiverId": receiverId}).sort({"createAt" : -1}).limit(limit).exec();
    },
    countNotifUnread(userId){
        return this.countDocuments({
            $and: [
                {"receiverId": userId},
                {"isRead": false}
            ]
        }).exec();
    }
};

const TYPES = {
    ADD_CONTACT: "add_contact"
};

const CONTENT = {
    getContent: (type, isRead, userId, username, avatar) => {
        if(type === TYPES.ADD_CONTACT){
            if(!isRead){
                return `<span class="notif-read-false" data-uid="${ userId }">
                    <img class="avatar-small" src="images/users/${avatar}" alt=""> 
                    <strong>${username}</strong> đã gửi cho bạn lời mời kết bạn!
                </span><br><br><br>`;
            }
            return `<span data-uid="${ userId }">
                    <img class="avatar-small" src="images/users/${avatar}" alt=""> 
                    <strong>${username}</strong> đã gửi cho bạn lời mời kết bạn!
                </span><br><br><br>`
        }
    }
};
module.exports = {
    model: mongoose.model("notification", NotificationSchema),
    types: TYPES,
    content: CONTENT
}
