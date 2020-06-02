import {check} from "express-validator/check"

let register = [
    check('email',"Email phải có dạng example@tiepnguyen.com").
        isEmail().
        trim(),
    check('gender',"giới tính phải được xác định").
        isIn(["male", "female"]),
    check('password',"mật khẩu chứa ít nhất 8 kí tự, gồm chữ hoa, thường và kí tự đặc biệt")
        .isLength({min:3}),
       // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check('password_confirmation',"mật khẩu nhập lại không khớp")
        .custom((value, {req}) =>  value === req.body.password)
];



module.exports = {
    register: register
    
}