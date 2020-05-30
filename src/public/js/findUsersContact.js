function callFindUsers(e){
    if(e.which===13 || e.type==="click"){
        var keyword = $("#input-find-users-contact").val();
        if(!keyword.length){
            alertify.notify("Bạn chưa nhập nội dung", "error", 3);
            return false;
        }     
    }
    $.get(`/contact/find-users/${keyword}`, function(data){
        $("#find-user ul").html(data);
        addContact(); // js/addContact.js
        removeContact(); //js/removeContact.js
    })
}

$(document).ready(function(){
    $("#input-find-users-contact").bind("keypress", callFindUsers);
    $("#btn-find-users-contact").bind("click", callFindUsers);
});