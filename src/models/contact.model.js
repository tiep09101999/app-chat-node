import mongoose from "mongoose"
let Schema = mongoose.Schema;
let ContactSchema =  new Schema({
    userId:String,
    contactId:String,
    status:{type: Boolean, default:false},
    createAt: {type:String, default: Date.now},
    updateAt: {type:String, default: null},
    deleteAt: {type:String, default: null}
});

ContactSchema.statics= {
    createNew(item){
        return this.create(item);
    },

    // tim ban be cua 1 user
    findAllByUser(userId){
        return this.find({
            $or: [
                {"userId" : userId},
                {"contactId": userId}
            ]
        }).exec();
    },
    /**
     * kiem tra su ton tai cua 2 user
     * @param {String} userId 
     * @param {String} contactId 
     */
    checkExists(userId, contactId){
        return this.findOne({
            $or: [
                {$and: [
                    {"userId":userId},
                    {"contactId": contactId}
                ]},
                {$and: [
                    {"userId":contactId},
                    {"contactId": userId}
                ]}
            ]
        }).exec();
    },

    removeReqContact(userId, contactId){
        return this.deleteOne({
            $and: [
                {"userId":userId},
                {"contactId": contactId}
            ]
        }).exec();
    },
    /**
     * lấy ra các ContactUser
     * @param {*} userId 
     * @param {*} limit 
     */
    getContacts(userId, limit){
        return this.find({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).sort({"createAt": -1}).limit(limit).exec();
    },
    /**
     * lấy ra danh sách các User mình đang gửi lời mời kết bạn
     * @param {*} userId 
     * @param {*} limit 
     */
    getContactsSent(userId, limit){
        return this.find({
            $and: [
                {"userId": userId},
                {"status": false}
            ]
        }).sort({"createAt": -1}).limit(limit).exec();
    },
    /**
     * lấy ra danh sách các User đang gửi lời mời kết bạn cho mình
     * @param {*} userId 
     * 
     */
    getContactsReceived(userId, limit){
        return this.find({
            $and: [
                {"contactId": userId},
                {"status": false}
            ]
        }).exec();
    },
    countAllContacts(userId){
        return this.countDocuments({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).exec();
    },
    /**
     * đếm danh sách các User mình đang gửi lời mời kết bạn
     * @param {*} userId 
     *
     */
    countAllContactsSent(userId){
        return this.countDocuments({
            $and: [
                {"userId": userId},
                {"status": false}
            ]
        }).exec();
    },
    /**
     * đếm slg danh sách các User đang gửi lời mời kết bạn cho mình
     * @param {*} userId 
     * @param {*} limit 
     */
    countAllContactsReceived(userId){
        return this.countDocuments({
            $and: [
                {"contactId": userId},
                {"status": false}
            ]
        }).exec();
    }
};

module.exports = mongoose.model("contact", ContactSchema);
