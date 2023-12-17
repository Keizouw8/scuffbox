import rooms from "../data/rooms.js";

export default class User {
    constructor(socket, name, room){
        var that = this;
        this.socket = socket;

        this.id = socket.id;
        this.room = room;
        this.name = name;
        this.quality = 0.5;
        this.money = 1000;
        this.finished = false;

        this.properties = {
            skin: 4,
            colors: ["#D41D0F", "#010001"]
        };

        this.stances = {
            racialEquality: 0,
            genderEquality: 0,
            selfSufficiency: 0.5
        };

        this.legislation = {
            nativeLand: 0,
            tax: 1
        };

        socket.on("start", function(){
            that.room.host.emit("start");
        });

        socket.on("skip", function(){
            that.room.host.emit("skip");
        });

        socket.on("finish", function(){
            that.finished = true;
            that.room.host.emit("finished", Object.values(that.room.users).reduce((a, i) => a + i.finished, 0), Object.keys(that.room.users).length);
        });

        socket.on("callback", (...args) => that.room.host.emit("callback", ...args, socket.id));
        
        socket.on("closeRoom", function(){
            Object.values(that.room.users).forEach(user => user.socket.emit("dc"));
            that.room.host.emit("dc");
            delete rooms?.[that.room.id];
        });

        socket.on("update", function(key, value){
            if(key == "skin"){
                that.quality = value / 8;
                that.money = value * 250;

                socket.emit("money", that.money);
                socket.emit("popularity", that.quality);
            }
            that.properties[key] = value;
            that.room.host.emit("update", that.object());
        });

        socket.on("debate", function(opponent){
            if(that.money < 500) return;
            if(!Object.keys(that.room.users).includes(opponent)) return;
            that.money -= 500;
            socket.emit("money", that.money);
            that.room.host.emit("debate", that.id, opponent);
        });

        socket.on("legislation", function(key, value){
            if(that.money < 1000) return;
            that.money -= 1000;
            socket.emit("money", that.money);
            that.legislation[key] = value;
            that.room.host.emit("legislation", socket.id, key, value);
        });

        socket.on("stance", function(key, value){
            that.stances[key] = Math.min(1, Math.max(0, value));
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