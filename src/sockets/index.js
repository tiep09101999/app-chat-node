import addNewContact from "./contact/addNewContact";
import removeReqContact from "./contact/removeRequestContact";

let initSockets = (io) => {
    //
    addNewContact(io);
    removeReqContact(io);
}

module.exports = initSockets;