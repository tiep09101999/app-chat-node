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
               let messageOfMe = $(`<div class=" bubble me data-mess-id="${data.message._id}"></div>`)
               if(dataTextEmojiForSend.isChatGroup){
                    messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" 
                                     class ="avatar-small" title ="${data.message.sender.name}" >`);
                    messageOfMe.text(data.message.text);
                    increaseNumberMessage(divId);
               } else {
                    messageOfMe.text(data.message.text);
               }
               let convertEmoji = emojione.toImage(messageOfMe.html());
               messageOfMe.html(convertEmoji);
            
               $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
               nineScrollRight(divId);
               
               // xóa dữ liệu ở input sau khi gửi
               $(`#write-chat-${divId}`).val("");
               that.find(".emojionearea-editor").text("");

               // hien thi tin nhắn mới và time mới
               $(`.person[data-chat=${divId}]`).find(`span.time`).html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
               $(`.person[data-chat=${divId}]`).find(`span.preview`).html(emojione.toImage(data.message.text));

               // chuyển conversation lên đầu 
               $(`.person[data-chat=${divId}]`).on("click.moveOn", function(){
                   let conversationMoveOn = $(this).parent();
                   $(this).closest("ul").prepend(conversationMoveOn);
                   $(this).off("click.moveOn");
               })
               $(`.person[data-chat=${divId}]`).click();

               // emit socket lên server
               let dataSend = {
                   id: divId,
                   messageOfMe: messageOfMe
               }
               socket.emit("send-message", dataSend);

               
               
            }).fail(function(error){
                 console.log(error);
            });
            
            
        }
    })
}