


function removeContactReceiveds(){
    $(".user-remove-request-contact-received").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url:"/contact/remove-request-contact-received",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    // nếu muốn khi hủy kết bạn thì cũng xóa thông báo của ng đó gửi lời mời
                    // kết bạn thì hiện dòng code dưới
                    // xóa thông báo
                   // $(".noti_content").find(`span[data-uid= ${data.id}]`).remove();
                   // decreaseNotification("noti_counter");
                  
                    // Xóa ở modal đang chờ xác nhận
                    decreaseNotification("noti_contact_counter");
                    decreaseCount("count-request-contact-received");
                    $("#request-contact-received").find(`li[data-uid= ${targetId}]`).remove();

                    
                    socket.emit("remove-req-contact-received", {contactId: targetId});
                    // xử lý realtime
                }
            }
        })
    })
};

socket.on("res-remove-req-contact-received", function(data){
    $("#find-user").find(`div.user-remove-request-contact[data-uid= ${data.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid= ${data.id}]`).css("display", "inline-block");

    $("#request-contact-sent").find(`li[data-uid= ${data.id}]`).remove();

    decreaseCount("count-request-contact-sent");
    decreaseNotification("noti_contact_counter");
    
})

$(document).ready(function(){
    removeContactReceiveds();
})