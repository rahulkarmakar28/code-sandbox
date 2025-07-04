import { io } from "../index"

interface SubmissionResultMessage {
    roomID: string;
    output: any;
}

interface RedisClient {
    subscribe(channel: string, listener: (message: string) => void): Promise<void>;
}

export async function initSubscriber(redisClient: RedisClient): Promise<void> {
    await redisClient.subscribe("submission_result", (message: string) => {
        const { roomID, output } = JSON.parse(message) as SubmissionResultMessage;
        // console.log(`Got result for room ${roomID}`);

        // ✅ Emit to the room via WebSocket
        io.to(roomID).emit("codeOutput", JSON.stringify(output));
        // console.log(`Sent result to socket room ${roomID}`);
    });
}