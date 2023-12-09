import { randomBytes } from "crypto";

var rooms = {};

export class Rooms{
    constructor(){
        this.id = randomBytes(6).toString("hex").toUpperCase();
        this.users = {};
        this.owner = false;
    }

    join(user){
        this.users.push(user);
        if(!this.owner) this.owner = user.id;
    }

    leave(id){
        delete this.users[id];
        if(this.owner != id) return;
        this.owner = Object.keys(this.users)?.[0]?.id || false;
    }
};

export default rooms;