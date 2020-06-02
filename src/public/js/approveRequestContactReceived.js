


function approveContactReceiveds(){
    $(".user-approve-request-contact-received").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
       
        $.ajax({
            url:"/contact/approve-request-contact-received",
            type: "put",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove();
                    $(userInfo).find("div.user-remove-request-contact-received").remove();
                    $(userInfo).find(".contactPanel")
                    .append(`
                    <div class="user-talk" data-uid="${targetId}">
                        Trò chuyện
                    </div>
                    <div class="user-remove-contact action-danger" data-uid="${targetId}">
                        Xóa liên hệ
                    </div>
                    `);
                    let userInfoHTML = userInfo.get(0).outerHTML;
                    $("#contacts").find("ul").prepend(userInfoHTML);
                    $(userInfo).remove();
                    decreaseCount("count-request-contact-received");
                    increaseNumber("count-contacts");
                    decreaseCount("noti_contact_counter");
                   socket.emit("approve-request-contact-received", {contactId: targetId});
                }
            }
        })
    })
};

socket.on("res-approve-req-contact-received", function(data){
    let notify = ` <span class="notif-read-false" data-uid="${ data.id }">
                        <img class="avatar-small" src="images/users/${data.avatar}" alt=""> 
                        <strong>${data.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
                    </span><br><br><br> `;

    // prepend Nghĩa là đẩy các thông báo từ trên xuống
    // append là đẩy từ dưới lên 
    $(".noti_content").prepend(notify);
    decreaseNotification("noti_contact_counter");
    increaseNotification("noti_counter");
    decreaseCount("count-request-contact-sent");
    increaseNumber("count-contacts");
    $("#request-contact-sent").find(`ul li[data-uid= ${data.id}]`).remove();
    $("#find-user").find(`ul li[data-uid= ${data.id}]`).remove();
    let userInfoHTML = `
    <li class="_contactList" data-uid="${data.id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${data.avatar}" alt="">
            </div>
            <div class="user-name">
                <p>
                ${data.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>&nbsp ${data.address}</span>
            </div>
            <div class="user-talk" data-uid="${data.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${data.id}">
                Xóa liên hệ
            </div>
        </div>
    </li>   
    `;
    $("#contacts").find("ul").prepend(userInfoHTML);
    // // Thêm cuộc trò chuyện trong khung chat
})

$(document).ready(function(){
    approveContactReceiveds();
})