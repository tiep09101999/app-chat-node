import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/user.model";



// Kiểm tra tài khoản user bằng local
let localStrategy = passportLocal.Strategy;
let initPassportLocal = () => {
 
    
    
    passport.use(new localStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email);
            // Tham số của done:
            // thứ nhất là null ( k có lỗi trả về),
            // thứ 2 là false ( k có giá trị trả về),
            // req.flash
            if(!user){
                return done(null, false, req.flash("errors", "Tài khoản hoặc mật khẩu sai"));
            }
            if(!user.local.isActive){
                return done(null, false, req.flash("errors", "Tài khoản chưa được active"));
            }
           // let checkPassword = await user.comparePassword(password);
           let checkPassword =  user.comparePassword(password);
            if(!checkPassword){
                return done(null, false, req.flash("errors", "Tài khoản hoặc mật khẩu sai"));
            } 
            let content = `Xin chào ${email}`;
            return done(null, user, req.flash("success", content));

        } catch (e) {
            return done(null, false, req.flash("errors", "Hệ thống đang lỗi. Thử lại sau"))
        }
    }));

       // lưu userId vào session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        UserModel.findUserById(id)
            .then(user =>{
                return done(null,user);
            })
            .catch(e => {
                return done(e, null);
            })
    });
};

module.exports = initPassportLocal;