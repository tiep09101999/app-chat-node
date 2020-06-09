function typingOn(divId){
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        socket.emit("user-is-typing", {groupId: targetId})
    } else {
        socket.emit("user-is-typing", {contactId: targetId})
    }
}
function typingOff(divId){
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        socket.emit("user-is-not-typing", {groupId: targetId})
    } else {
        socket.emit("user-is-not-typing", {contactId: targetId})
    }
}

$(document).ready(function(){
    socket.on("res-user-is-typing", function(data){
        let messageTyping = `<div class="bubble you  bubble-typing-gif">
                                <img src="/images/chat/typing.gif" />
                            </div>`;
        if(data.currentGroupId){
            if(data.currentUserId !== $("#dropdown-navbar-user").data("uid")){
                let check =  $(`.chat[data-chat=${data.currentGroupId}]`).find("div.bubble-typing-gif");
                if(check.length){
                   return false;
                }
                $(`.chat[data-chat=${data.currentGroupId}]`).append(messageTyping);
                nineScrollRight(data.currentGroupId);
            }
        } else {
            let check =  $(`.chat[data-chat=${data.currentUserId}]`).find("div.bubble-typing-gif");
            if(check.length){
                return false;
            }
            $(`.chat[data-chat=${data.currentUserId}]`).append(messageTyping);
            nineScrollRight(data.currentUserId);
        }
    });
    socket.on("res-user-is-not-typing", function(data){
        if(data.currentGroupId){
            if(data.currentUserId !== $("#dropdown-navbar-user").data("uid")){
                $(`.chat[data-chat=${data.currentGroupId}]`).find("div.bubble-typing-gif").remove();
                nineScrollRight(data.currentGroupId);
            }
        } else {
            $(`.chat[data-chat=${data.currentUserId}]`).find("div.bubble-typing-gif").remove();
            nineScrollRight(data.currentUserId);
        }
    })
})