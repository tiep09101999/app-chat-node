import mongoose from "mongoose"
let Schema = mongoose.Schema;
let MessageSchema =  new Schema({
    sender: {
        id: String,
        username: String,
        avatar: String
    },
    receiver: {
        id: String,
        username: String,
        avatar: String
    },
    text: String,
    file: {
        data: Buffer, 
        contentType: String,
        fileName: String
    },
    createAt: {type:String, default: Date.now},
    updateAt: {type:String, default: null},
    deleteAt: {type:String, default: null}
})

module.exports = mongoose.model("message", MessageSchema);
