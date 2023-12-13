import { randomBytes } from "crypto";
import Population from "../game/population.js";

var rooms = {};

export class Room{
    constructor(){
        this.host = false;
        this.hostCode = randomBytes(10).toString("hex").toUpperCase();
        this.id = randomBytes(2).toString("hex").toUpperCase();
        this.users = {};
        this.owner = false;
        this.population = new Population(1e4);
    }

    setHost(host){
        this.host = host;

        var that = this;
        host.on("disconnect", function(){
            Object.values(that.users).forEach(user => user.socket.emit("dc"));
        });
    }

    join(user){
        this.users[user.id] = user;
        this.host.emit("join", user.object());
        user.socket.on("disconnect", () => this.leave(user.id));

        if(this.owner) return;
        this.owner = user.id;
        this.host.emit("owner", user.id);
        user.socket.emit("owner");
    }

    leave(id){
        delete this.users[id];
        this.host.emit("leave", id);

        if(this.owner != id) return;
        this.owner = Object.keys(this.users)?.[0] || false;
        this.host.emit("owner", this.owner);
        this.users?.[this.owner]?.emit("owner");
    }
};

export default rooms;