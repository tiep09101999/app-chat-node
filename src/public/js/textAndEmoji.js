function textAndEmoji(divId){
    $(".emojionearea").unbind("keyup").on("keyup", function(e){
        let that = $(this);
        if(e.which === 13){
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if(!targetId.length ||  !messageVal.length){
                return false;
            }

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal
            }
            if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
                dataTextEmojiForSend.isChatGroup= true;
            }

            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){
                let dataToEmit = {
                    message: data.message
                }
               let messageOfMe = $(`<div class=" bubble me" data-mess-id="${data.message._id}"></div>`)
               messageOfMe.text(data.message.text);
               let convertEmoji = emojione.toImage(messageOfMe.html());
               if(dataTextEmojiForSend.isChatGroup){
                   let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" 
                                     class ="avatar-small" title ="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${convertEmoji}`);
                    dataToEmit.groupId= targetId;
                    increaseNumberMessage(divId);
               } else {
                    dataToEmit.contactId= targetId;
                    messageOfMe.html(convertEmoji);
               }
               
              
            
               $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
               nineScrollRight(divId);
               
               // xóa dữ liệu ở input sau khi gửi
               $(`#write-chat-${divId}`).val("");
               that.find(".emojionearea-editor").text("");

               // hien thi tin nhắn mới và time mới
               $(`.person[data-chat=${divId}]`).find(`span.time`).removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
               $(`.person[data-chat=${divId}]`).find(`span.preview`).html(emojione.toImage(data.message.text));

               // chuyển conversation lên đầu 
               // TRIGGER EVENT NAMESPACE
               $(`.person[data-chat=${divId}]`).on("tiepnguyen.moveOn", function(){
                    let conversationMoveOn = $(this).parent();
                    $(this).closest("ul").prepend(conversationMoveOn);
                    $(this).off("tiepnguyen.moveOn");
                 })
              $(`.person[data-chat=${divId}]`).trigger("tiepnguyen.moveOn");


               // emit socket lên server
               socket.emit("chat-text-emoji", dataToEmit);
               // sau khi gửi tin nhắn thì tắt typing  
               typingOff(divId);

               
               
            }).fail(function(error){
                 console.log(error);
            });
            
            
        }
    })
}

$(document).ready(function(){
    socket.on("res-chat-text-emoji" , function(data){
                let divId = "";
               let messageOfYou = $(`<div class=" bubble you" data-mess-id="${data.message._id}"></div>`)
               messageOfYou.text(data.message.text);
               let convertEmoji = emojione.toImage(messageOfYou.html());
               if(data.currentGroupId){
                   let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" 
                                     class ="avatar-small" title ="${data.message.sender.name}" />`;
                    messageOfYou.html(`${senderAvatar} ${convertEmoji}`);
                    divId= data.currentGroupId;
                    
               } else {
                    divId= data.currentUserId;
                    messageOfYou.html(convertEmoji);
               }
               if(data.currentUserId !== $("#dropdown-navbar-user").data("uid")){
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
                    nineScrollRight(divId); 
                    increaseNumberMessage(divId);
                    $(`.person[data-chat=${divId}]`).find(`span.time`).addClass("message-time-realtime")
               }
              
                // hien thi tin nhắn mới và time mới
                $(`.person[data-chat=${divId}]`).find(`span.time`).html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find(`span.preview`).html(emojione.toImage(data.message.text));
                
                // chuyển conversation lên đầu 
                $(`.person[data-chat=${divId}]`).on("tiepnguyen.moveOn", function(){
                    let conversationMoveOn = $(this).parent();
                    $(this).closest("ul").prepend(conversationMoveOn);
                    $(this).off("tiepnguyen.moveOn");
                })
                $(`.person[data-chat=${divId}]`).trigger("tiepnguyen.moveOn");
  
    })
})