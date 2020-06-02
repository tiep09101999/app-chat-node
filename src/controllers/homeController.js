import {getNotification, countNotifUnread} from "../services/notificationService";
import {getContacts, getContactsSent, getContactsReceived,countAllContacts,countAllContactsSent,countAllContactsReceived} from "../services/contactService";

module.exports.getHome = async (req,res) => {
    let notifications = await getNotification(req.user._id);
    let countNotifUnreads = await countNotifUnread(req.user._id);
    let contacts = await getContacts(req.user._id);
    let contactsSent = await getContactsSent(req.user._id);
    let contactsReceived = await getContactsReceived(req.user._id);
    let countAllContactss = await countAllContacts(req.user._id);
    let countAllContactsSents = await countAllContactsSent(req.user._id);
    let countAllContactsReceiveds = await countAllContactsReceived(req.user._id);
    return  res.render("main/master",{
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications: notifications,
        countNotifUnreads: countNotifUnreads,
        contacts: contacts,
        contactsSent: contactsSent,
        contactsReceived: contactsReceived,
        countAllContactss: countAllContactss,
        countAllContactsSents: countAllContactsSents,
        countAllContactsReceiveds: countAllContactsReceiveds
    });
      
  }; 
