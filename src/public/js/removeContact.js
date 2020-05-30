
function decreaseCount(className){
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue--;
    if(currentValue === 0){
        $(`.${className}`).html("");
    }
    else $(`.${className}`).html(`(<em>${currentValue}</em>)`);
}
function removeContact(){
    $(".user-remove-request-contact").bind("click",function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url:"/contact/remove-request",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    $("#find-user").find(`div.user-remove-request-contact[data-uid= ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid= ${targetId}]`).css("display", "inline-block");
                    decreaseCount("count-request-contact-sent");
                    // xử lý realtime
                }
            }
        })
    })
}