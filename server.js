import http from "http"
import express from "express"
import ConnectDB from "./src/config/connectDB"
import ContactModel from "./src/models/contact.model"
import viewEngine from "./src/config/viewEngine"
import initRoutes from "./src/routes/web"
import bodyParser from "body-parser"
import connectFlash from "connect-flash"
import configSession from "./src/config/session"
import passport from "passport"

let app = express();

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

// config passport

app.use(passport.initialize());
app.use(passport.session());

// khoi tao cac Route
initRoutes(app);

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 8888");
})