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
    createAt: {type:String, default: Date.now},
    updateAt: {type:String, default: null},
    deleteAt: {type:String, default: null}
})

module.exports = mongoose.model("chat-group", ChatGroupSchema);
