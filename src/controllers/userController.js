import multer from "multer";
import fsExtra from "fs-extra";
import {updateUser} from "../services/userService";

// lưu trữ ảnh avatar vào thư mục public/images/users
let storeAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/users");
    },
    filename: (req,file,callback) => {
        let avatarName = `${Date.now()}-${file.originalname}`;
        callback(null, avatarName);
    }
});

let avatarUploadFile = multer({
    storage: storeAvatar
}).single("avatar");
module.exports.updateAvatar= (req,res) => {
    avatarUploadFile(req , res, async () => {
        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updateAt: Date.now()
            };
            let userUpdate = await updateUser(req.user._id, updateUserItem);
            // xóa avatar cũ
            await fsExtra.remove(`src/public/images/users/${userUpdate.avatar}`);
            let result = {
                message: "Cập nhật avatar thành công",
                imageSrc: `/images/users/${req.file.filename}`
            }
            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send(error);
        } 
    });

}