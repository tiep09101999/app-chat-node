import mongoose from "mongoose"
import bcrypt from "bcrypt"
let Schema = mongoose.Schema;
let UserSchema =  new Schema({
    username: String,
    gender: {type: String, default:"male"},
    phone: {type: String, default: null},
    address: {type: String, default: null},
    avatar: {type: String, default: "avatar-default.jpg"},
    role: {type:String, default: "user"},
    local: {
        email: {type:String, trim: true},
        password: String,
        isActive:{ type:Boolean, default: false},
        verifyToken: String
    },
    // facebook: {
    //     uid: String,
    //     token:String,
    //     email: {type:String, trim:true}
    // },
    // google: {
    //     uid: String,
    //     token:String,
    //     email: {type:String, trim:true}
    // },
    createAt: {type:Number, default: Date.now},
    updateAt: {type:Number, default: null},
    deleteAt: {type:Number, default: null}
});

UserSchema.statics= {
    createNew(item){
        return this.create(item);
    },
    findByEmail(email){
        return this.findOne({"local.email": email}).exec();
    },

    removeById(id){
        return this.findOneAndRemove({"_id":id}).exec();
    },
    verify(token) {
        return this.findOneAndUpdate(
            {"local.verifyToken": token},
            {
                "local.isActive": true,
                "local.verifyToken": null
            }
        ).exec();
    },
    findUserById(id){
        return this.findOne({"_id": id}).exec();
    },
    findNormalUserById(id){
        return this.findById(id,{
             _id:1,
            username:1,
            address:1,
            avatar:1
        }).exec();
    },
    // updateUser(id, item){
    //     return this.findOneAndUpdate({
    //         "_id": id
    //     }, {"avatar": item.avatar, "updateAt": item.updateAt}).exec();
    // },
    updateUser(id, item){
        return this.findByIdAndUpdate(id,item).exec();
    },
    updatePassword(id, item){
        return this.findByIdAndUpdate(id,{"local.password": item}).exec();
    },

    findAllForAddContact(friendUser, keyword){
        return this.find({
            $and: [
                {"_id": {$nin: friendUser}},
                {"local.isActive": true},
                {$or: [
                    {"username": {"$regex": new RegExp(keyword, "i")}},
                    {"local.email": {"$regex":  new RegExp(keyword, "i")}}
                ]}
            ]
        },{
            _id:1,
            username:1,
            address:1,
            avatar:1
        }).exec();
    }
};

UserSchema.methods = {
    comparePassword(password){
        // tra ve 1 promise
        // return bcrypt.compare(password, this.local.password);
        if(password == this.local.password) return true;
        return false;
    }

}

module.exports = mongoose.model("user", UserSchema);
