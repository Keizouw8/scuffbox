export default class User {
    constructor(socket, name, room){
        var that = this;
        this.socket = socket;

        this.id = socket.id;
        this.room = room;
        this.name = name;
        this.quality = 1;
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
            if(key == "skin"){
                that.quality = value / 4;
                that.money = value * 250;

                socket.emit("money", that.money);
                socket.emit("popularity", that.quality);
            }
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
            if(that.money < 500) return;
            that.money -= 500;
            socket.emit("money", that.money);
            if(Object.keys(that.room.users).includes(opponent)) that.room.host.emit("debate", that.id, opponent);
        });

        socket.on("callback", (...args) => that.room.host.emit("callback", ...args, socket.id));
    }

    object(){
        return {
            ...this,
            room: this.room.id,
            socket: undefined
        }
    }
}