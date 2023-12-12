import rooms, { Room } from "../data/rooms.js";

export default function(socket, callback){
    var room = new Room();
    rooms[room.id] = room;
    callback(room.hostCode);
}