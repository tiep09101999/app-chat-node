import mongoose from "mongoose"
let Schema = mongoose.Schema;
let MessageSchema =  new Schema({
    senderId: String,
    receiverId: String,
    conversationType: String,
    messageType: String,
    sender: {
        id: String,
        name: String,
        avatar: String
    },
    receiver: {
        id: String,
        name: String,
        avatar: String
    },
    text: String,
    file: {
        data: Buffer, 
        contentType: String,
        fileName: String
    },
    createdAt: {type:Number, default: Date.now},
    updatedAt: {type:Number, default: null},
    deletedAt: {type:Number, default: null}
});
const Type = {
    personal: "personal",
    group: "group"
}
const message_type = {
    text: "text",
    image: "image",
    file: "file"
}
MessageSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    getMessages(senderId, receiverId, limit){
        return this.find({
            $or: [
                {$and: [
                    {"senderId": senderId},
                    {"receiverId": receiverId}
                ]},
                {$and: [
                    {"receiverId": senderId},
                    {"senderId": receiverId}
                ]}
            ],
        }).sort({"createdAt": 1}).limit(limit).exec();
    },
    getMessagesInGroup( receiverId, limit){
        return this.find(
           {"receiverId":receiverId}
        ).sort({"createdAt": 1}).limit(limit).exec();
    }
}

module.exports = {
    model: mongoose.model("message", MessageSchema),
    conversationType: Type,
    message_type: message_type
}
