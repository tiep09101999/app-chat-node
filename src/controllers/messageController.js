import {addNewTextEmoji} from "../services/messageService";

module.exports.addNewTextEmoji = async (req, res)=> {
    try {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }
        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;

  
        
      //  return res.status(200).send({message: sender})
        let newMessage = await addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);
        return res.status(200).send({message: newMessage});
    } catch (error) {
       return res.status(500).send(error);
    }
}