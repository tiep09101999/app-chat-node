
function decreaseCount(className){
    let currentValue = +($(`.${className}`).find("em").text());
    currentValue--;
    if(currentValue === 0){
        $(`.${className}`).html("");
    }
    else $(`.${className}`).html(`(<em>${currentValue}</em>)`);
};

function decreaseNotification(className){
    let currentValue = +($(`.${className}`).text());
    currentValue--;
    if(currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    }
    else $(`.${className}`).css("display", "block").html(currentValue);
}
function removeContact(){
    $(".user-remove-request-contact").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url:"/contact/remove-request",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    $("#find-user").find(`div.user-remove-request-contact[data-uid= ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid= ${targetId}]`).css("display", "inline-block");

                    // Xóa ở modal đang chờ xác nhận
                    decreaseNotification("noti_contact_counter");
                    decreaseCount("count-request-contact-sent");

                    $("#request-contact-sent").find(`li[data-uid= ${targetId}]`).remove();
                    socket.emit("remove-req-contact", {contactId: targetId});
                    // xử lý realtime
                }
            }
        })
    })
};

socket.on("res-remove-req-contact", function(data){
    // xóa thông báo
    $(".noti_content").find(`span[data-uid= ${data.id}]`).remove();

    $("#request-contact-received").find(`li[data-uid= ${data.id}]`).remove();
    decreaseCount("count-request-contact-received");
    decreaseNotification("noti_contact_counter");
    decreaseNotification("noti_counter");
})

$(document).ready(function(){
    removeContact();
})