// lib/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function useSocket(roomID: string, onOutput: (output: string) => void) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!roomID || initialized.current) return;

        socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL!}`, {
            transports: ["websocket"], //skip polling
        });

        socket.on("connect", () => {
            // console.log("Socket connected:", socket.id);
            // console.log(roomID)
            socket.emit("joinRoom", roomID); // Join specific room
        });

        socket.on("codeOutput", (output: string) => {
            // console.log("Received output:", output);
            onOutput(output); // Callback to UI
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        initialized.current = true;

        return () => {
            socket.disconnect();
            initialized.current = false;
        };
    }, [roomID]);
}
