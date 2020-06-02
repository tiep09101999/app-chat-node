
import {findUsersContactService, addNew, removeReqContact, removeReqContactReceived, approveRequestContactReceived} from "../services/contactService";
module.exports.findUsersContact = async (req,res) => {
    try {
        // lay userId trong session
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await findUsersContactService(currentUserId, keyword);
        return res.render("main/findUser", {users});
        console.log(users);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports.addNew = async (req,res) => {
    try {
        // lay userId trong session
        let currentUserId = req.user._id;
        let contactId = req.body.uid; // lay du lieu tu post

        let newContact = await addNew(currentUserId, contactId);
        return res.status(200).send({success: !!newContact});
       
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports.removeContact = async (req,res) => {
    try {
        // lay userId trong session
        let currentUserId = req.user._id;
        let contactId = req.body.uid; // lay du lieu tu post

        let removeReq = await removeReqContact(currentUserId, contactId);
        return res.status(200).send({success: !!removeReq});
       
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.removeContactReceived = async (req,res) => {
    try {
        // lay userId trong session
        let currentUserId = req.user._id;
        let contactId = req.body.uid; // lay du lieu tu post

        let removeReq = await removeReqContactReceived(currentUserId, contactId);
        return res.status(200).send({success: !!removeReq});
       
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.approveRequestContactReceived = async (req,res) => {
    try {
        // lay userId trong session
        let currentUserId = req.user._id;
        let contactId = req.body.uid; // lay du lieu tu post

        let approveReq = await approveRequestContactReceived(currentUserId, contactId);
        return res.status(200).send({success: !!approveReq});
       
    } catch (error) {
        return res.status(500).send(error);
    }
};

