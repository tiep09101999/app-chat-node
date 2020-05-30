import mongoose from "mongoose"
import bluebird from "bluebird"

// connect MongoDB
require('dotenv').config();
mongoose.set('useFindAndModify', false);

let connectDB = () => {
    mongoose.Promise = bluebird;
   
    // mongodb://localhost:27017/app-chat-nodejs
    let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    return mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports = connectDB;