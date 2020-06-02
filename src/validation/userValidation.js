import {check} from "express-validator/check"

/**
 * Tất cả các trường đều thêm thuộc tính optional()
 * vì có thể người dùng chỉ update 1 số trường chứ không phải
 * toàn bộ
 * nếu không có optional() thì sẽ không validation được trường đó
 */
let updateInfo = [
    check('username',"Username từ 3 đến 17 kí tự và không chứa kí tự đặc biệt").
        optional().
        isLength({min:3, max:17}),
    check('gender',"giới tính phải được xác định").
        optional().
        isIn(["male", "female"]),
    check('address',"Địa chỉ chỉ từ 3 đến 17 kí tự").
        optional().
        isLength({min:3, max:17}),
    check('phone',"Số điện thoại không hợp lệ").
        optional().
        matches(/^(0)[0-9]{9,10}$/)
];



module.exports = {
    updateInfo: updateInfo
}