import addNewContact from "./contact/addNewContact";
import approveRequestContactReceived from "./contact/approveRequestContactReceived";
import removeReqContact from "./contact/removeRequestContact";
import removeReqContactReceived from "./contact/removeRequestContactReceived";
import removeFriend from "./contact/removeFriend";
import chatTextEmoji from "./chat/chatTextEmoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
import chatImage from "./chat/chatImage";
import chatAttachment from "./chat/chatAttachment";

let initSockets = (io) => {
    //
    addNewContact(io);
    removeReqContact(io);
    removeReqContactReceived(io);
    approveRequestContactReceived(io);
    removeFriend(io);
    chatTextEmoji(io);
    typingOn(io);
    typingOff(io);
    chatImage(io);
    chatAttachment(io);
}

module.exports = initSockets;