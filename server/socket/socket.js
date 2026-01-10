const http =require('http');
const {Server} =require("socket.io");
const express =require('express');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE","PATCH"],
    },
});

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};

let userSocketMap = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    
    if(userId != "undefined"){ userSocketMap[userId] = socket.id; }
    io.emit("gettingUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit("gettingUsers", Object.keys(userSocketMap));
    }) 
});

module.exports = {
  server,
  io,
  getReceiverSocketId,
};


