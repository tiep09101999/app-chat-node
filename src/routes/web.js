import express from "express"
import {register} from "../validation/authValidation"
import authController from "../controllers/authController"
import homeController from "../controllers/homeController"
import initPassportLocal from "../controllers/passportController/local"
import passport from "passport"
import contactControllers from "../controllers/contactControllers"; 
// -------------------------

 // init passport local
initPassportLocal();
let router = express.Router();

let initRoutes = (app) => {
    router.get("/", authController.checkLoggedIn,  homeController.getHome);
    router.get("/login-register", authController.checkLoggedOut, authController.getLoginRegister);
    router.post("/register",authController.checkLoggedOut,register,authController.postRegister);
    router.get("/verify/:token",authController.checkLoggedOut, authController.verifyAccount);
    router.post("/login", passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/login-register",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/contact/find-users/:keyword", authController.checkLoggedIn, contactControllers.findUsersContact);
    router.post("/contact/add-new" , authController.checkLoggedIn, contactControllers.addNew )
    router.delete("/contact/remove-request", authController.checkLoggedIn, contactControllers.removeContact);

    router.get("/logout",  authController.checkLoggedIn,authController.getLogout);
   
    
    return app.use("/", router)
};

module.exports = initRoutes;