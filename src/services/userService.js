import UserModel from "../models/user.model";

/**
 * 
 * @param {_id} id 
 * @param {data Object} item 
 */
let updateUser = (id, item) => {
    return UserModel.updateUser(id,item);
};

module.exports = {
    updateUser: updateUser
}