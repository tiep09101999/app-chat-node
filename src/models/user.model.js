import mongoose from "mongoose"
import bcrypt from "bcrypt"
let Schema = mongoose.Schema;
let UserSchema =  new Schema({
    username: String,
    gender: {type: String, default:"male"},
    phone: {type: Number, default: null},
    address: {type: String, default: null},
    avatar: {type: String, default: "avatar-default.jpg"},
    role: {type:String, default: "user"},
    local: {
        email: {type:String, trim: true},
        password: String,
        isActive:{ type:Boolean, default: false},
        verifyToken: String
    },
    facebook: {
        uid: String,
        token:String,
        email: {type:String, trim:true}
    },
    google: {
        uid: String,
        token:String,
        email: {type:String, trim:true}
    },
    createAt: {type:String, default: Date.now},
    updateAt: {type:String, default: null},
    deleteAt: {type:String, default: null}
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
        return this.findById(id).exec();
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