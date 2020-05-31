function increaseNumber(className){
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue++;
    if(currentValue === 0){
        $(`.${className}`).html("");
    }
    else $(`.${className}`).html(`(<em>${currentValue}</em>)`);
};

function increaseNotification(className){
    let currentValue = +$(`.${className}`).text();
    currentValue++;
    if(currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    }
    else $(`.${className}`).css("display", "block").html(currentValue);
}

function addContact(){
    $(".user-add-new-contact").bind('click', function(){
        let targetId= $(this).data("uid");
        $.post("/contact/add-new", {uid: targetId}, function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid= ${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid= ${targetId}]`).css("display", "inline-block");
                increaseNumber("count-request-contact-sent");

                let userInfo = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML;
                $("#request-contact-sent").find("ul").prepend(userInfo);
                console.log(userInfo);
                // xử lý realtime
                socket.emit("add-new-contact", {contactId : targetId});
            
            }
        })
    })
};

socket.on("res-add-new-contact", function(data){
    let notify = ` <span class="notif-read-false" data-uid="${ data.id }">
                        <img class="avatar-small" src="images/users/${data.avatar}" alt=""> 
                        <strong>${data.username}</strong> đã gửi cho bạn lời mời kết bạn!
                    </span><br><br><br> `;
    
    // prepend Nghĩa là đẩy các thông báo từ trên xuống
    // append là đẩy từ dưới lên 
    $(".noti_content").prepend(notify);
    increaseNumber("count-request-contact-received");
    increaseNotification("noti_contact_counter");
    increaseNotification("noti_counter");

    let userInfoHTML = `<li class="_contactList" data-uid="${data.id}">
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
                                <div class="user-acccept-contact-received" data-uid="${data.id}">
                                    Chấp nhận
                                </div>
                                <div class="user-reject-request-contact-received action-danger" data-uid="${data.id}">
                                    Xóa yêu cầu
                                </div>
                            </div>
                        </li>`;
    $("#request-contact-received").find("ul").prepend(userInfoHTML);
})