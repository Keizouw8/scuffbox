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

        socket.on("debate", function(opponent){
            if(Object.keys(that.room.users).includes(opponent)) that.room.host.emit("debate", that.id, opponent);
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