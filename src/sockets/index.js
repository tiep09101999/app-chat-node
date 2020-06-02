import addNewContact from "./contact/addNewContact";
import approveRequestContactReceived from "./contact/approveRequestContactReceived";
import removeReqContact from "./contact/removeRequestContact";
import removeReqContactReceived from "./contact/removeRequestContactReceived";
import removeFriend from "./contact/removeFriend";

let initSockets = (io) => {
    //
    addNewContact(io);
    removeReqContact(io);
    removeReqContactReceived(io);
    approveRequestContactReceived(io);
    removeFriend(io);
}

module.exports = initSockets;