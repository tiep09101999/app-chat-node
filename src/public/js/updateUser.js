let userAvatar =  null;
let userInfo = {};
let originAvatarSrc = null;  // link ảnh gốc ban đầu khi chưa sửa
let originInfo = {};
let userUpdatePassword = {};
function updateUserInfo(){
    $("#input-change-avatar").bind("change", function(){
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
        let username =  $(this).val();
        if(username.length > 17 || username.length < 3){
            alertify.notify("Username từ 3 đến 17 kí tự và không chứa kí tự đặc biệt", "error",3);
            $(this).val(originInfo.username);
            delete userInfo.username;
            return false;
        }
        userInfo.username = $(this).val();
    });
    $("#input-change-gender-male").bind("click", function(){
        let gender =  $(this).val();
        if(gender !== "male"){
            alertify.notify("Giới tính phải được xác định", "error",3);
            $(this).val(originInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = $(this).val();
    });
    $("#input-change-gender-female").bind("click", function(){
        let gender =  $(this).val();
        if(gender !== "female"){
            alertify.notify("Giới tính phải được xác định", "error",3);
            $(this).val(originInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = $(this).val();
        userInfo.gender = $(this).val();
    });
    $("#input-change-address").bind("change", function(){
        let address =  $(this).val();
        if(address.length > 17 || address.length < 3){
            alertify.notify("Địa chỉ chỉ từ 3 đến 17 kí tự", "error",3);
            $(this).val(originInfo.address);
            delete userInfo.address;
            return false;
        }
        userInfo.address = $(this).val();
    });
    $("#input-change-phone").bind("change", function(){
        let phone =  $(this).val();
        let regExp = new RegExp(/^(0)[0-9]{9,10}$/);

        if(!regExp.test(phone)){
            alertify.notify("Số điện thoại không hợp lệ", "error",3);
            $(this).val(originInfo.phone);
            delete userInfo.phone;
            return false;
        }
        userInfo.phone = $(this).val();
    });
    $("#input-change-current-password").bind("change", function(){
        let currentPassword =  $(this).val();
       

        if(currentPassword.length < 6){
            alertify.notify("Mật khẩu ít nhất 6 kí tự", "error",3);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }
        userUpdatePassword.currentPassword = $(this).val();
    });
    
    $("#input-change-new-password").bind("change", function(){
        let newPassword =  $(this).val();
       

        if(newPassword.length < 6){
            alertify.notify("Mật khẩu ít nhất 6 kí tự", "error",3);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }
        userUpdatePassword.newPassword = $(this).val();
    });
    
    $("#input-change-new-confirm-password").bind("change", function(){
        let confirmNewPassword =  $(this).val();
        if(!userUpdatePassword.newPassword){
            alertify.notify("Bạn chưa nhập mật khẩu mới", "error",3);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }

        if(confirmNewPassword !== userUpdatePassword.newPassword){
            alertify.notify("Mật khẩu xác nhận không khớp", "error",3);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        userUpdatePassword.confirmNewPassword = $(this).val();
    });
};

function callUpdateAvatar(){
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
};

function callUpdateInfo(){
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function(result){
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");
            $("#navbar-username").text(userInfo.username);

            // $("#input-btn-cancel-update-user").click();
        },
        error: function(error){
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            $("#input-btn-cancel-update-user").click();
        }
    })
};

function callLogout(){
    let timerInterval;
    Swal.fire({
        position: 'top-end',
        title: 'Đăng xuất sau 5 giây',
        html: "<strong></strong>",
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
               Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerleft() / 1000);
                //Swal.getContent().querySelector("strong").textContent = Swal.getTimerleft();
            }, 1000);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
      }).then((result) => {
          $.get("/logout", function(){
              location.reload();
          })
      })
}

function callUpdateUserPassword(){
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function(result){
            $(".user-modal-password-alert-success").find("span").text(result.message);
            $(".user-modal-password-alert-success").css("display", "block");
            $("#input-btn-cancel-update-user-password").click();
            // đăng xuất sau khi đổi mật khẩu
            callLogout();
        },
        error: function(error){
            $(".user-modal-password-alert-error").find("span").text(error.responseText);
            $(".user-modal-password-alert-error").css("display", "block");

            $("#input-btn-cancel-update-user-password").click();
        }
    })
}
$(document).ready(function(){
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originInfo = {
        username: $("#input-change-username").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val(),
        gender: ($("#input-change-gender-male").is(":checked"))? $("#input-change-gender-male").val() : $("#input-change-gender-female").val()
    };
    updateUserInfo();
    $("#input-btn-update-user").bind("click",function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn chưa thay đổi dữ liệu", "error",3);
            return false;
        }
        if(userAvatar) {
            callUpdateAvatar();
        }
        if(!$.isEmptyObject(userInfo)){
            callUpdateInfo();
        }
    });
    $("#input-btn-cancel-update-user").bind("click",function(){
        $("#user-modal-avatar").attr("src", originAvatarSrc);
        $("#input-change-avatar").val(null);
        userAvatar = null;
        userInfo = {};
    });
    $("#input-btn-update-user-password").bind("click",function(){
        if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword){
            alertify.notify("Bạn phải nhập đầy đủ thông tin", "error",3);
            return false;
        };
        Swal.fire({
            title: 'Bạn chắc chắn muốn thay đổi mật khẩu không ?',
            text: "Mật khẩu sẽ được thay đổi",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2ecc71',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: "Hủy bỏ"
          }).then((result) => {
            if (!result.value) {
                $("#input-btn-cancel-update-user-password").click();
                return false;
            }
            callUpdateUserPassword();
          })
        
    });
    $("#input-btn-cancel-update-user-password").bind("click",function(){
        userUpdatePassword = {};
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-new-password").val(null);
    });
});