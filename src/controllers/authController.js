import {validationResult, param} from "express-validator/check"
import {register, verifyAcc} from "../services/authService"


module.exports.getLoginRegister = (req,res) => {
    return  res.render("auth/loginRegister",{
        errors: req.flash("errors"),
        success: req.flash("success")
    });
  };
module.exports.postRegister = async (req,res) => {
    let errors = [];
    let success = [];

    let validationError = validationResult(req);

    if(!validationError.isEmpty()){
        let error= Object.values(validationError.mapped());
        error.forEach((e) => {
            errors.push(e.msg);
        })
        req.flash("errors",errors);
        return res.redirect("/login-register");
    }
    try {
        let notify = await register(req.body.email, req.body.gender, req.body.password, req.protocol, req.get("host"));
        success.push(notify);
        req.flash("success",success);
        return res.redirect("/login-register");
    } catch (error) {
        errors.push(error);
        req.flash("errors",errors);
        return res.redirect("/login-register")
    }
};

module.exports.verifyAccount = async (req,res) => {
    let errors = [];
    let success = [];
    try {
        let verifySuccess = await verifyAcc(req.params.token);
        success.push(verifySuccess);
        req.flash("success",success);
        return res.redirect("/login-register");
    } catch (e) {
        errors.push(error);
        req.flash("errors",errors);
        return res.redirect("/login-register")
    }
}

module.exports.getLogout = (req,res) => {
    req.logout();
    req.flash("success", "Đăng xuất thành công");
    return res.redirect('/login-register');
}

module.exports.checkLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        return res.redirect("/login-register");
    }
    next();
}

module.exports.checkLoggedOut = (req,res,next) => {
    if(req.isAuthenticated()){
        return res.redirect("/");
    }
    next();
}
