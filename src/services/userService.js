import UserModel from "../models/user.model";
import { resolve, reject } from "bluebird";

/**
 * 
 * @param {_id} id 
 * @param {data Object} item 
 */
let updateUser = (id, item) => {
    return UserModel.updateUser(id,item);
};
let updatePassword = (id, item) => {
    return new Promise( async (resolve,reject) => {
        let currentUser = await UserModel.findUserById(id);
        if(!currentUser){
            return reject("Tài khoản không tồn tại");
        }
        let checkPassword = await currentUser.comparePassword(item.currentPassword);
        if(!checkPassword){
            return reject("Mật khẩu hiện tại không chính xác");
        }
        await UserModel.updatePassword(id, item.newPassword);
        resolve(true);
    })
};

module.exports = {
    updateUser: updateUser,
    updatePassword: updatePassword
}