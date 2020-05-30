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
    }
};

module.exports = mongoose.model("contact", ContactSchema);
