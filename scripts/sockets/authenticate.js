import rooms from "../data/rooms.js";
import User from "../data/user.js";

export default function(socket){
    if(socket.handshake.auth.type == undefined || !socket.handshake.auth.user || !socket.handshake.auth.room) return socket.emit("dc");
    
    if(!Object.keys(rooms).includes(socket.handshake.auth.room)) return socket.emit("dc");
    var room = rooms[socket.handshake.auth.room];

    if(socket.handshake.auth.type == 1){
        if(room.host) return socket.emit("dc");
        if(room.hostCode != socket.handshake.auth.user) return socket.emit("dc");
        return room.setHost(socket);
    }

    room.join(new User(socket, socket.handshake.auth.user, room));
}