import socketProcessor from "./socketProcessor.js";
import makeRoom from "./makeRoom.js";
import authenticate from "./authenticate.js";

export default function(socket){
	if(Object.keys(socket.handshake.auth).length) return authenticate(socket);
	
	var processor = socketProcessor(socket);
	socket.on("makeRoom", processor(makeRoom));
}