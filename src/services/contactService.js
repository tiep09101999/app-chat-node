import ContactModel from "../models/contact.model";
import UserModel from "../models/user.model"
import NotificationModel from "../models/notification.model"
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

        let notificationItem = {
            senderId: currentUsersId,
            receiverId: contactId,
            type: NotificationModel.types.ADD_CONTACT
        };
        await NotificationModel.model.createNew(notificationItem);
        resolve(newContact);
    });
};

let removeReqContact =  (currentUsersId, contactId) => {
    return new Promise( async (resolve, reject) => {
        let removeReq = await ContactModel.removeReqContact(currentUsersId, contactId);
        let type_add = NotificationModel.types.ADD_CONTACT;
        await NotificationModel.model.removeReqContactNotification(currentUsersId,contactId, type_add);
        resolve(true);
    });
};
let removeReqContactReceived =  (currentUsersId, contactId) => {
    return new Promise( async (resolve, reject) => {
        let removeReq = await ContactModel.removeContactReceived(currentUsersId, contactId);
        // let type_add = NotificationModel.types.ADD_CONTACT;
        // await NotificationModel.model.removeReqContactReceivedNotification(currentUsersId,contactId, type_add);
        resolve(true);
    });
};
let removeFriend =  (currentUsersId, contactId) => {
    return new Promise( async (resolve, reject) => {
        let removeFriend = await ContactModel.removeFriend(currentUsersId, contactId);
        if(removeFriend.result.n === 0){
            return reject(false);
        }
        resolve(true);
    });
};
let approveRequestContactReceived =  (currentUsersId, contactId) => {
    return new Promise( async (resolve, reject) => {
        let approveReq = await ContactModel.approveRequestContactReceived(currentUsersId, contactId);
        let notificationItem = {
            senderId: currentUsersId,
            receiverId: contactId,
            type: NotificationModel.types.APPROVE_CONTACT
        };
        await NotificationModel.model.createNew(notificationItem);
        resolve(true);
    });
};

let countAllContacts =  (currentUsersId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContacts(currentUsersId);
            
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsSent =  (currentUsersId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsSent(currentUsersId);
            
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsReceived =  (currentUsersId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsReceived(currentUsersId);
            
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};
let getContacts =  (currentUsersId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUsersId, 10);
            let users = contacts.map( async (e) => {
                if(e.contactId == currentUsersId ){
                    return await UserModel.findUserById(e.userId);
                } else {
                    return await UserModel.findUserById(e.contactId);
                }
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let getContactsSent =  (currentUsersId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsSent(currentUsersId, 10);
            let users = contacts.map( async (e) => {
                return await UserModel.findUserById(e.contactId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let getContactsReceived =  (currentUsersId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsReceived(currentUsersId, 10);
            let users = contacts.map( async (e) => {
                return await UserModel.findUserById(e.userId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    findUsersContactService: findUsersContact,
    addNew: addNew,
    removeReqContact: removeReqContact,
    getContacts:getContacts,
    getContactsSent:getContactsSent,
    getContactsReceived:getContactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived:countAllContactsReceived,
    removeReqContactReceived: removeReqContactReceived,
    approveRequestContactReceived: approveRequestContactReceived,
    removeFriend: removeFriend
}