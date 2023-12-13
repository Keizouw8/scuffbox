import { randomBytes } from "crypto";

export default class User {
    constructor(socket, name, room){
        var that = this;
        this.socket = socket;

        this.id = randomBytes(12).toString("hex");
        this.room = room;
        this.name = name;
        this.quality = 0.5;
        this.money = 0;

        this.properties = {
            ready: false,
            skin: 4,
            colors: ["#D41D0F", "#010001"]
        }

        this.legislation = {
            nativeLand: 0,
            tax: 0,
            freedoms: {
                women: false,
                black: false
            }
        };

        socket.on("update", function(key, value){
            that.properties[key] = value;
            that.room.host.emit("update", that.object());
        });
    }

    object(){
        return {
            ...this,
            room: this.room.id,
            socket: undefined
        }
    }
}