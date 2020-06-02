
/**
 * 
 * @param  io  from socket.io in server.js
 */
let approveRequestContactReceived =  (io) => {
    let clients = {};
        io.on("connection", (socket) => {
            let currentUserId =  socket.request.user._id;
             /**
             * Trong truong hop user mở nhiều tab ( mỗi tab là 1 socket.id riêng)
             * thì sẽ có nhiều socketId cho user đó. Phải lưu vào 1 mảng
             * để có thể truyền về cho tất cả các tab
             */
            
            if(clients[currentUserId]){
                clients[currentUserId].push(socket.id);
            } else {
                clients[currentUserId] = [socket.id];
            }

        socket.on("approve-request-contact-received", (data) => {
            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: (socket.request.user.address !== null) ? socket.request.user.address : ""
            };
            // nếu user đc gửi lời mời đang onl thì emit về user đó
            if(clients[data.contactId]){
                clients[data.contactId].forEach(e => {
                    io.sockets.connected[e].emit("res-approve-req-contact-received", currentUser);
                })
            }
            
        });
        socket.on("disconnect",() => {
            clients[currentUserId] = clients[currentUserId].filter((e) => {
                return e !== socket.id;
            });
            if(! clients[currentUserId].length){
                delete  clients[currentUserId];
            }
        })
    });
};

module.exports = approveRequestContactReceived;