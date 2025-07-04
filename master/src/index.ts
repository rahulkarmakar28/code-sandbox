import { Request, Response } from "express"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";


import runRoutes from "./routes/run.route"
import { initRedis, initSubscriberRedis } from "./config/redis.config"
import { rateLimiter } from './middlwares/rateLimiter'
import { initSubscriber } from "./services/subscriber"
import { registerSocketHandlers } from "./socket";

dotenv.config()

const app = express()
export const redisClient = initRedis()
const redisSubscriber = initSubscriberRedis()
initSubscriber(redisSubscriber)

const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: { origin: `${process.env.FRONTEND_URL!}` },
});
registerSocketHandlers(io);

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}))
app.use(rateLimiter)
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("👋 from Sandbox backend ")
})
app.use("/api/v1/run", runRoutes);


const port: string = process.env.PORT!
httpServer.listen(port, () => {
    console.log(`Sandbox server is running at ${process.env.BACKEND_HOST}:${port}`)
})