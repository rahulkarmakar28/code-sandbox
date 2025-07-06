"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSubscriber = initSubscriber;
const index_1 = require("../index");
async function initSubscriber(redisClient) {
    await redisClient.subscribe("submission_result", (message) => {
        const { roomID, output } = JSON.parse(message);
        // console.log(`Got result for room ${roomID}`);
        // ✅ Emit to the room via WebSocket
        index_1.io.to(roomID).emit("codeOutput", JSON.stringify(output));
        // console.log(`Sent result to socket room ${roomID}`);
    });
}
