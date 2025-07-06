"use strict";
// socket.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = registerSocketHandlers;
function registerSocketHandlers(io) {
    io.on("connection", (socket) => {
        // console.log("Socket connected:", socket.id);
        socket.on("joinRoom", (roomID) => {
            socket.join(roomID);
            // console.log(`Socket ${socket.id} joined room ${roomID}`);
        });
        socket.on("disconnect", () => {
            //   console.log("Socket disconnected:", socket.id);
        });
    });
}
