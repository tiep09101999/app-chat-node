import mongoose from "mongoose"
let Schema = mongoose.Schema;
let ChatGroupSchema =  new Schema({
    name: String,
    userAmount: {type: Number, min:3, max:200},
    messageAmount: {type: Number, default:0},
    userId: String,
    members: [
        {userId:String}
    ],    
    createAt: {type:Number, default: Date.now},
    updateAt: {type:Number, default: Date.now},
    deleteAt: {type:Number, default: null}
});

ChatGroupSchema.statics = {
    // $elem la doi tuong element
    getChatGroups(id, limit) {
        return this.find({
            "members": {$elemMatch: {"userId": id}}
        }).sort({"updateAt": -1}).limit(limit).exec();
    },
    // lấy tất cả chat group id có thằng user
    getChatGroupIdsByUser(id) {
        return this.find({
            "members": {$elemMatch: {"userId": id}}
        }).exec();
    },
    getChatGroupReceiver(id) {
        return this.findOne({"_id": id}).exec();
    },
    updateWhenHasNewMessage(id, count){
        return this.findByIdAndUpdate({"_id":id}, {
            "messageAmount": count,
            "updateAt": Date.now()
        }).exec();
    }
}

module.exports = mongoose.model("chat-group", ChatGroupSchema);
