


function removeFriend(){
    $(".user-remove-contact").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
       
        $.ajax({
            url:"/contact/remove-friend",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                $("#contacts").find(`ul li[data-uid= ${targetId}]`).remove();
                decreaseCount("count-contacts"); // js/removeContact.js
                // Xóa cuộc trò chuyện trong khung chat
                socket.emit("remove-friend", {contactId: targetId});
            }
        })
    })
};

socket.on("res-remove-friend", function(data){
    $("#contacts").find(`ul li[data-uid= ${data.id}]`).remove();
    decreaseCount("count-contacts");
})

$(document).ready(function(){
    removeFriend();
})