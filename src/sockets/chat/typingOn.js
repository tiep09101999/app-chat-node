
/**
 * 
 * @param  io  from socket.io in server.js
 */
let typingOn =  (io) => {
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
            socket.request.user.chatGroupIds.forEach(group => {
                if(clients[group._id]){
                    clients[group._id].push(socket.id);
                } else {
                    clients[group._id] = [socket.id];
                }
            })
        socket.on("user-is-typing", (data) => {
            if(data.groupId){
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id
                };
                // nếu user đc gửi lời mời đang onl thì emit về user đó
                if(clients[data.groupId]){
                    clients[data.groupId].forEach(e => {
                        io.sockets.connected[e].emit("res-user-is-typing", response);
                    })
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId: socket.request.user._id
                };
                // nếu user đc gửi lời mời đang onl thì emit về user đó
                if(clients[data.contactId]){
                    clients[data.contactId].forEach(e => {
                        io.sockets.connected[e].emit("res-user-is-typing", response);
                    })
                }
            }
        });
        socket.on("disconnect",() => {
            clients[currentUserId] = clients[currentUserId].filter((e) => {
                return e !== socket.id;
            });
            if(! clients[currentUserId].length){
                delete  clients[currentUserId];
            }
            socket.request.user.chatGroupIds.forEach(group => {
                clients[group._id] = clients[group._id].filter((e) => {
                    return e !== socket.id;
                });
                if(! clients[group._id].length){
                    delete  clients[group._id];
                }
            })
        })
    });
};

module.exports = typingOn;