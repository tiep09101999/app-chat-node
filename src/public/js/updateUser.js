let userAvatar =  null;
let userInfo = {};
let originAvatarSrc = null;  // link ảnh gốc ban đầu khi chưa sửa
function updateUserInfo(){
    $("#input-change-avatar").bind("change", function(){
        let fileData = $(this).prop("files")[0];
        let math = ["image/png","image/jpg","image/jpeg"];
        let limit = 1048576; // 104876 byte = 1Mb

        if($.inArray(fileData.type, math) === -1){
            alertify.notify("Kiểu file không hợp lệ. ( jpg/png/jpeg )", "error",3);
            $(this).val(null);
            return false;
        };
        if(fileData.size > limit){
            alertify.notify("Ảnh phải có kích thước nhỏ hơn 1MB", "error",3);
            $(this).val(null);
            return false;
        }
        if(typeof FileReader != "undefined"){
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();
            let fileReader = new FileReader();
            fileReader.onload = function(element){
                $("<img>",{
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);
            userAvatar = formData;
        } else {
            alertify.notify("Trình duyệt không hỗ trợ FileReader", "error",3);
        }
    });
    $("#input-change-username").bind("change", function(){
        userInfo.username = $(this).val();
    });
    $("#input-change-gender-male").bind("click", function(){
        userInfo.gender = $(this).val();
    });
    $("#input-change-gender-female").bind("click", function(){
        userInfo.gender = $(this).val();
    });
    $("#input-change-address").bind("change", function(){
        userInfo.address = $(this).val();
    });
    $("#input-change-phone").bind("change", function(){
        userInfo.phone = $(this).val();
    });
}

$(document).ready(function(){
    updateUserInfo();
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    $("#input-btn-update-user").bind("click",function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn chưa thay đổi dữ liệu", "error",3);
            return false;
        }
        $.ajax({
            url: "/user/update-avatar",
            type: "put",
            cache: false,
            processData: false,
            contentType: false,
            data: userAvatar,
            success: function(result){
                $(".user-modal-alert-success").find("span").text(result.message);
                $(".user-modal-alert-success").css("display", "block");

                // update avatar ở thanh cá nhân góc phải
                $("#navbar-avatar").attr("src",result.imageSrc);
                originAvatarSrc = result.imageSrc;
                $("#input-btn-cancel-update-user").click();
            },
            // error: function(error){
            //     console.log(error);
            //     $(".user-modal-alert-error").find("span").text(error.responseText);
            //     $(".user-modal-alert-error").css("display", "block");
            // }
        })
    });
    $("#input-btn-cancel-update-user").bind("click",function(){
        $("#user-modal-avatar").attr("src", originAvatarSrc);
        $("#input-change-avatar").val(null);
        userAvatar = null;
        userInfo = {};
    });
});