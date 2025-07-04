// socket.ts

import { Server } from "socket.io";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        // console.log("Socket connected:", socket.id);

        socket.on("joinRoom", (roomID: string) => {
              socket.join(roomID);
            // console.log(`Socket ${socket.id} joined room ${roomID}`);
        });

        socket.on("disconnect", () => {
            //   console.log("Socket disconnected:", socket.id);
        });
    });
}
