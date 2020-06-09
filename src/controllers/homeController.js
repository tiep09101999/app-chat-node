import {getNotification, countNotifUnread} from "../services/notificationService";
import {getAllConversationItems} from "../services/messageService";
import {convert} from "./bufferToBase64";
import {getContacts, 
    getContactsSent, 
    getContactsReceived,
    countAllContacts,
    countAllContactsSent,
    countAllContactsReceived
} from "../services/contactService";
import moment from "moment";
import formatDistance from "date-fns/formatDistance";

let getLastItem = (arr) => {
    if(!arr.length) return [];
    else return arr[arr.length-1];
}

// chuyển time từ Number sang thời gian thực
let convertTime = (time) => {
    if(!time) return "";
    return moment(time).locale("vi").startOf("seconds").fromNow();
    // if(!time) return "";
    //  let rs= formatDistance(new Date(time), new Date());
    //  console.log(rs);
    //  return rs;
};

module.exports.getHome = async (req,res) => {
    let notifications = await getNotification(req.user._id);
    let countNotifUnreads = await countNotifUnread(req.user._id);
    let contacts = await getContacts(req.user._id);

    let getAllConversationItem = await getAllConversationItems(req.user._id);
    let getAllConversationWithMessages = getAllConversationItem.getAllConversationWithMessages;

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
        countAllContactsReceiveds: countAllContactsReceiveds,
        getAllConversationWithMessages: getAllConversationWithMessages,
        convert: convert,
        getLastItem: getLastItem,
        convertTime: convertTime
    });
      
  }; 
