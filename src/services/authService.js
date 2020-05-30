import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import sendMail from "../config/mailer";

import {v4 as uuidv4} from "uuid";
import { reject, resolve } from "bluebird";

// let saltRounds = 7;

let register = async (email, gender, password, protocol, host) => {
    return new Promise( async (resolve,reject) => {
        let userByEmail= await userModel.findByEmail(email);
        if(userByEmail){
            if(!userByEmail.local.isActive){
                return reject("Tài khoản đã tồn tại nhưng chưa được kích hoạt");
            }
            return reject("Email đã tồn tại");
        }
     //   let salt = bcrypt.genSaltSync(saltRounds);

        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
               // password: bcrypt.hashSync(password, salt),
                password: password,
                verifyToken: uuidv4()
            }
        };

        let user = await userModel.createNew(userItem);
        let link = `${protocol}://${host}/verify/${user.local.verifyToken}`;
        let content = `
        <h2>Bạn nhận được email này vì đã đăng kí tài khoản</h2>
        <h3> Vui lòng click vào link bên dưới để xác nhận </h3>
        <a href="${link}" target="blank">${link}</a>
        `;
        sendMail(email, "Verify account !!",content)
            .then(success =>  resolve("Kiểm tra email để xác thực tài khoản"))
            .catch(async (e) => {
                 await userModel.removeById(user._id);
                reject("Có lỗi khi xác thực");
            })
        
    })
};

let verifyAcc = (token) => {
    return new Promise( async (resolve,reject) => {
        await userModel.verify(token);
        resolve("Tài khoản đã kích hoạt thành công");
    })
}

module.exports = {
    register: register,
    verifyAcc: verifyAcc
};