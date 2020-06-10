


function attachmentChat(divId){
    $(`#attachment-chat-${divId}`).unbind("change").on("change", function(){
        let fileData = $(this).prop("files")[0];
        let limit = 1048576; // 104876 byte = 1Mb

        if(fileData.size > limit){
            alertify.notify("File phải có kích thước nhỏ hơn 1MB", "error",5);
            $(this).val(null);
            return false;
        }
        let targetId= $(this).data("chat");
        let isChatGroup = false;

        let messageFormData = new FormData();
        messageFormData.append("my-attachment-chat", fileData);
        messageFormData.append("uid", targetId);

        if($(this).hasClass("chat-in-group")){
            messageFormData.append("isChatGroup", true);
            isChatGroup= true;
        }
        $.ajax({
            url: "/message/add-new-attachment",
            type: "post",
            cache: false,
            processData: false,
            contentType: false,
            data: messageFormData,
            success: function(data){
                let dataToEmit = {
                    message: data.message
                }
               let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`)
               
                let attachmentChat = `
                                        <a href="data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" 
                                            download="${data.message.file.fileName}">
                                            ${data.message.file.fileName}
                                        </a>
                `;
               if(isChatGroup){
                   let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" 
                                     class ="avatar-small" title ="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
                    dataToEmit.groupId= targetId;
                    increaseNumberMessage(divId);
               } else {
                    dataToEmit.contactId= targetId;
                    messageOfMe.html(attachmentChat);
               }

               $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
               nineScrollRight(divId);

               // hien thi tin nhắn mới và time mới
               $(`.person[data-chat=${divId}]`).find(`span.time`).removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
               $(`.person[data-chat=${divId}]`).find(`span.preview`).html("Đã gửi một tệp đính kèm");

                // chuyển conversation lên đầu 
               // TRIGGER EVENT NAMESPACE 42
                $(`.person[data-chat=${divId}]`).on("tiepnguyen.moveOn", function(){
                let conversationMoveOn = $(this).parent();
                $(this).closest("ul").prepend(conversationMoveOn);
                $(this).off("tiepnguyen.moveOn");
                 })
                 $(`.person[data-chat=${divId}]`).trigger("tiepnguyen.moveOn");

                 // emit socket lên server
                socket.emit("chat-attachment", dataToEmit);
              
            },
            error: function(error){
                console.log(error);
            }
        })
    })
}

$(document).ready(function(data){
    socket.on("res-chat-attachment", function(data){
        let divId = "";
        let messageOfYou = $(`<div class=" bubble you  bubble-attachment-file" data-mess-id="${data.message._id}"></div>`)
        let attachmentChat = `
                                <a href="data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" 
                                    download="${data.message.file.fileName}">
                                    ${data.message.file.fileName}
                                </a>
                            `;
        if(data.currentGroupId){
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" 
                              class ="avatar-small" title ="${data.message.sender.name}" />`;
             messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
             divId= data.currentGroupId;
             
        } else {
             divId= data.currentUserId;
             messageOfYou.html(attachmentChat);
        }

        if(data.currentUserId !== $("#dropdown-navbar-user").data("uid")){
             $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
             nineScrollRight(divId); 
             increaseNumberMessage(divId);
             $(`.person[data-chat=${divId}]`).find(`span.time`).addClass("message-time-realtime")
        }
       
         // hien thi tin nhắn mới và time mới
         $(`.person[data-chat=${divId}]`).find(`span.time`).html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
         $(`.person[data-chat=${divId}]`).find(`span.preview`).html("Đã gửi một tệp đính kèm");
         
         // chuyển conversation lên đầu 
         $(`.person[data-chat=${divId}]`).on("tiepnguyen.moveOn", function(){
             let conversationMoveOn = $(this).parent();
             $(this).closest("ul").prepend(conversationMoveOn);
             $(this).off("tiepnguyen.moveOn");
         })
         $(`.person[data-chat=${divId}]`).trigger("tiepnguyen.moveOn");
    })
});