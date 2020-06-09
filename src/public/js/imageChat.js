function bufferToBase64(buffer){
    return btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    )
}

function imageChat(divId){
    $(`#image-chat-${divId}`).unbind("change").on("change", function(){
        let fileData = $(this).prop("files")[0];
        let math = ["image/png","image/jpg","image/jpeg"];
        let limit = 1048576; // 104876 byte = 1Mb

        if($.inArray(fileData.type, math) === -1){
            alertify.notify("Kiểu file không hợp lệ. ( jpg/png/jpeg )", "error",5);
            $(this).val(null);
            return false;
        };
        if(fileData.size > limit){
            alertify.notify("Ảnh phải có kích thước nhỏ hơn 1MB", "error",5);
            $(this).val(null);
            return false;
        }
        let targetId= $(this).data("chat");
        let isChatGroup = false;

        let messageFormData = new FormData();
        messageFormData.append("my-image-chat", fileData);
        messageFormData.append("uid", targetId);

        if($(this).hasClass("chat-in-group")){
            messageFormData.append("isChatGroup", true);
            isChatGroup= true;
        }
        $.ajax({
            url: "/message/add-new-image",
            type: "post",
            cache: false,
            processData: false,
            contentType: false,
            data: messageFormData,
            success: function(data){
                let dataToEmit = {
                    message: data.message
                }
               let messageOfMe = $(`<div class="bubble me" bubble-image-file" data-mess-id="${data.message._id}"></div>`)
               let imageChat = `<img src="data: ${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}"
                                    class="show-image-chat">`;
               if(isChatGroup){
                   let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" 
                                     class ="avatar-small" title ="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${imageChat}`);
                    dataToEmit.groupId= targetId;
                    increaseNumberMessage(divId);
               } else {
                    dataToEmit.contactId= targetId;
                    messageOfMe.html(imageChat);
               }

               $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
               nineScrollRight(divId);

               // hien thi tin nhắn mới và time mới
               $(`.person[data-chat=${divId}]`).find(`span.time`).removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
               $(`.person[data-chat=${divId}]`).find(`span.preview`).html("Đã gửi một ảnh");

                // chuyển conversation lên đầu 
               // TRIGGER EVENT NAMESPACE 42
                $(`.person[data-chat=${divId}]`).on("tiepnguyen.moveOn", function(){
                let conversationMoveOn = $(this).parent();
                $(this).closest("ul").prepend(conversationMoveOn);
                $(this).off("tiepnguyen.moveOn");
                 })
                 $(`.person[data-chat=${divId}]`).trigger("tiepnguyen.moveOn");

                 // emit socket lên server
                socket.emit("chat-image", dataToEmit);
              
            },
            error: function(error){
                console.log(error);
            }
        })
    })
}

$(document).ready(function(){
    socket.on("res-chat-image", function(data){
        let divId = "";
        let messageOfYou = $(`<div class=" bubble you  bubble-image-file" data-mess-id="${data.message._id}"></div>`)
        let imageChat = `<img src="data: ${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}"
                                    class="show-image-chat">`;
        if(data.currentGroupId){
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" 
                              class ="avatar-small" title ="${data.message.sender.name}" />`;
             messageOfYou.html(`${senderAvatar} ${imageChat}`);
             divId= data.currentGroupId;
             
        } else {
             divId= data.currentUserId;
             messageOfYou.html(imageChat);
        }

        if(data.currentUserId !== $("#dropdown-navbar-user").data("uid")){
             $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
             nineScrollRight(divId); 
             increaseNumberMessage(divId);
             $(`.person[data-chat=${divId}]`).find(`span.time`).addClass("message-time-realtime")
        }
       
         // hien thi tin nhắn mới và time mới
         $(`.person[data-chat=${divId}]`).find(`span.time`).html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
         $(`.person[data-chat=${divId}]`).find(`span.preview`).html("Đã gửi một ảnh");
         
         // chuyển conversation lên đầu 
         $(`.person[data-chat=${divId}]`).on("tiepnguyen.moveOn", function(){
             let conversationMoveOn = $(this).parent();
             $(this).closest("ul").prepend(conversationMoveOn);
             $(this).off("tiepnguyen.moveOn");
         })
         $(`.person[data-chat=${divId}]`).trigger("tiepnguyen.moveOn");
    })
})