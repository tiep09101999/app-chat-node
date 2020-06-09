import ContactModel from "../models/contact.model"
import UserModel from "../models/user.model"
import ChatGroupModel from "../models/chatGroup.model"
import MessageModel from "../models/message.models"
import _ from "lodash";
import fsExtra from "fs-extra";
// lấy ra toàn bộ cuộc trò chuyện
let getAllConversationItems = (currentUserId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, 10);
            let users = contacts.map( async (e) => {
                if(e.contactId == currentUserId ){
                    let userContact = await UserModel.findUserById(e.userId);
                    userContact.updateAt = e.updateAt;
                    return userContact;

                } else {
                    let userContact = await UserModel.findUserById(e.contactId);
                    userContact.updateAt = e.updateAt;
                    return userContact;
                }
            });
            let userConversations = await Promise.all(users);

           let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, 10);
           let allConversations = userConversations.concat(groupConversations);
           allConversations = _.sortBy(allConversations, (item) => {
               return -item.updateAt;
           });

           let get = allConversations.map(async (e) => {
                e = e.toObject();
                if(e.members){
                    let getMessages = await MessageModel.model.getMessagesInGroup(e._id, 20);
                    e.messages = _.reverse(getMessages);
                } else {
                    let getMessages = await MessageModel.model.getMessages(currentUserId, e._id, 20);
                    e.messages = _.reverse(getMessages);
                }
               
               return e;
           })
           let getAllConversationWithMessages = await Promise.all(get);
           getAllConversationWithMessages = _.sortBy(getAllConversationWithMessages, (item) => {
            return -item.updateAt;
        });
           let result = {
            userConversations: userConversations,
            groupConversations: groupConversations,
            allConversations: allConversations,
            getAllConversationWithMessages: getAllConversationWithMessages
            
           }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
};

/**
 * 
 * @param {Object} sender người gửi
 * @param {string} receiverId người nhận
 * @param {string} messageVal text mess
 * @param {bool} isChatGroup check chat nhóm hay personal
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise( async (resolve, reject) => {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupReceiver(receiverId);
               
                let receiver = {
                    id: receiverId,
                    name: getChatGroupReceiver.name,    
                    avatar: "group-avatar-trungquandev.png"
                };
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType:  MessageModel.conversationType.group,
                    messageType: MessageModel.message_type.text,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now()
                };
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(receiverId, getChatGroupReceiver.messageAmount +1);
                resolve(newMessage);

            } else {
                let getUserReceiver = await UserModel.findUserById(receiverId);
               
                let receiver = {
                    id: receiverId,
                    name: getUserReceiver.username,    
                    avatar: getUserReceiver.avatar
                };
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType:  MessageModel.conversationType.personal,
                    messageType: MessageModel.message_type.text,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    
                    createdAt: Date.now()
                };
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id, receiverId);
                resolve(newMessage);
            }
    })
}
/**
 * 
 * @param {Object} sender người gửi
 * @param {string} receiverId người nhận
 * @param {file} messageVal file image
 * @param {bool} isChatGroup check chat nhóm hay personal
 */
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise( async (resolve, reject) => {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupReceiver(receiverId);
               
                let receiver = {
                    id: receiverId,
                    name: getChatGroupReceiver.name,    
                    avatar: "group-avatar-trungquandev.png"
                };

                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType:  MessageModel.conversationType.group,
                    messageType: MessageModel.message_type.image,
                    sender: sender,
                    receiver: receiver,
                    file : {
                        data: imageBuffer, 
                        contentType: imageContentType,
                        fileName: imageName
                    },
                    createdAt: Date.now()
                };
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(receiverId, getChatGroupReceiver.messageAmount +1);
                resolve(newMessage);

            } else {
                let getUserReceiver = await UserModel.findUserById(receiverId);
               
                let receiver = {
                    id: receiverId,
                    name: getUserReceiver.username,    
                    avatar: getUserReceiver.avatar
                };
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType:  MessageModel.conversationType.personal,
                    messageType: MessageModel.message_type.image,
                    sender: sender,
                    receiver: receiver,
                    file : {
                        data: imageBuffer, 
                        contentType: imageContentType,
                        fileName: imageName
                    },
                    
                    createdAt: Date.now()
                };
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id, receiverId);
                resolve(newMessage);
            }
    })
}
module.exports = {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage
};