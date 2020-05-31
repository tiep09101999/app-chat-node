import http from "http"
import express from "express"
import ConnectDB from "./src/config/connectDB"
import ContactModel from "./src/models/contact.model"
import viewEngine from "./src/config/viewEngine"
import initRoutes from "./src/routes/web"
import bodyParser from "body-parser"
import connectFlash from "connect-flash"
import {configSession, sessionStore} from "./src/config/session"
import passport from "passport"
import socketio from "socket.io";
import initSockets from "./src/sockets/index";

import cookieParser from "cookie-parser"
import {configSocketio} from "./src/config/socketio";

let app = express();

// init server with socket.io
let server = http.createServer(app);
let io = socketio(server);

require('dotenv').config();
app.use(bodyParser.urlencoded({extended: true}));
// Ket noi voi MongoDB
ConnectDB();

//cau hinh session để lưu session vào DB
configSession(app);
// config engine
viewEngine(app);

// khoi tao flash session
app.use(connectFlash());

// use cookie-parser
app.use(cookieParser());

// config passport

app.use(passport.initialize());
app.use(passport.session());

// khoi tao cac Route
initRoutes(app);

// cau hinh socketio de su dung duoc req 
// config/socketio.js
configSocketio(io, cookieParser, sessionStore);


// khoi tao cac socket
initSockets(io);

server.listen(process.env.PORT, () => {
    console.log("Server is running on port 8888");
})