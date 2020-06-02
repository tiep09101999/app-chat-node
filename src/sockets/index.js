import addNewContact from "./contact/addNewContact";
import approveRequestContactReceived from "./contact/approveRequestContactReceived";
import removeReqContact from "./contact/removeRequestContact";
import removeReqContactReceived from "./contact/removeRequestContactReceived";

let initSockets = (io) => {
    //
    addNewContact(io);
    removeReqContact(io);
    removeReqContactReceived(io);
    approveRequestContactReceived(io);
}

module.exports = initSockets;