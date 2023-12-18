import rooms from "../data/rooms.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PassThrough } from "stream";

export default function(req, res){
    if(req.params.user == "powell") return res.sendFile(join(dirname(fileURLToPath(import.meta.url)), "../../static/avatars/powell.png"))
    if(!rooms?.[req.params.room]?.users?.[req.params.user]?.face) return res.sendFile(join(dirname(fileURLToPath(import.meta.url)), "../../static/avatars/mii.png"));
    var bufferStream = new PassThrough();
    bufferStream.end(rooms[req.params.room].users[req.params.user].face);
    bufferStream.pipe(res)
}