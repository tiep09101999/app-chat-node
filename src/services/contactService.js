import ContactModel from "../models/contact.model";
import UserModel from "../models/user.model"
import _ from "lodash";
let findUsersContact =  (currentUsersId, keyword) => {
    return new Promise( async (resolve, reject) => {
        let friendUserId = [currentUsersId];
        let contactByUser = await ContactModel.findAllByUser(currentUsersId);
        // tra ve 1 list cac user co contact voi nhau
        contactByUser.forEach((e) => {
            friendUserId.push(e.userId);
            friendUserId.push(e.contactId);
        });
        friendUserId = _.uniqBy(friendUserId);
        // friendUserId = friendUserId.slice(1);
        
        let users = await UserModel.findAllForAddContact(friendUserId,keyword);
        resolve(users);
    });
};

let addNew =  (currentUsersId, contactId) => {
    return new Promise( async (resolve, reject) => {
        let contactExists = await ContactModel.checkExists(currentUsersId, contactId);
        if(contactExists){
            return reject(false);
        }

        let newContactItem = {
            userId: currentUsersId,
            contactId: contactId
        };
        let newContact = await ContactModel.createNew(newContactItem);
        resolve(newContact);
    });
};

let removeReqContact =  (currentUsersId, contactId) => {
    return new Promise( async (resolve, reject) => {
        let removeReq = await ContactModel.removeReqContact(currentUsersId, contactId);
        // if(removeReq.result.n == 0){
        //    return reject(false);
        // }
        resolve(true);
    });
};

module.exports = {
    findUsersContactService: findUsersContact,
    addNew: addNew,
    removeReqContact: removeReqContact
}