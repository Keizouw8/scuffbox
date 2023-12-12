import { randomBytes } from "crypto";

export default class User {
    constructor(socket, name, roomid){
        this.id = randomBytes(12).toString("hex");
        this.room = roomid;
        this.name = name;
        this.ready = false;
        this.quality = 0.5;
        this.skin = 1;
        this.money = 0;
        this.legislation = {
            nativeLand: 0,
            tax: 0,
            freedoms: {
                women: false,
                black: false
            }
        };

        this.socket = socket;
    }

    object(){
        return {
            ...this,
            socket: undefined
        }
    }
}