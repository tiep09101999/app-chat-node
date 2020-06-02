


function removeFriend(){
    $(".user-remove-contact").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        let username =$(this).parent().find("div.user-name p").text();
        Swal.fire({
            title: `Bạn chắc chắn muốn xóa ${username} ?`,
            text: "Bạn không thể hoàn tác thao tác này",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ecc71',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: "Hủy bỏ"
          }).then((result) => {
              console.log(result);
            if (!result.value) {
                return false;
            }
            $.ajax({
                url:"/contact/remove-friend",
                type: "delete",
                data: {uid: targetId},
                success: function(data){
                    console.log(data);
                    if(data.success){
                        $("#contacts").find(`ul li[data-uid= ${targetId}]`).remove();
                        decreaseCount("count-contacts"); // js/removeContact.js
                        // Xóa cuộc trò chuyện trong khung chat
                        socket.emit("remove-friend", {contactId: targetId});
                    }
                   
                }
            })
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