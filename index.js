import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import router from "./scripts/routes/router.js";
import connectionHandler from "./scripts/sockets/connectionHandler.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(router);

io.on("connection", connectionHandler);

server.listen(8888, console.log("Listening on port 8888"));