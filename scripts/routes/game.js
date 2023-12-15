import rooms from "../data/rooms.js";

export default function(req, res){
    if(req.params.id.length == 4){
        if(req.query.name.length > 12 || !req.query.name.length) return res.redirect("/join");
        if(!Object.keys(rooms).includes(req.params.id)) return res.redirect("/join");
        if(!rooms[req.params.id].host) return res.redirect("/join");
        if(rooms[req.params.id].ingame) return res.redirect("/join");

        return res.render("pages/player", {
            room: req.params.id,
            name: req.query.name
        });
    }
    if(req.params.id.length == 20){
        for(var i of Object.keys(rooms)){
            if(rooms[i].hostCode != req.params.id) continue;
            if(rooms[i].host) return res.redirect("/");

             return res.render("pages/host", {
                room: rooms[i].id,
                host: rooms[i].hostCode
            });
        }
        return res.redirect("/");
    }
    res.send("invalid room");
}