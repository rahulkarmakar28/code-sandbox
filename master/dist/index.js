"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const run_route_1 = __importDefault(require("./routes/run.route"));
const turnstile_route_1 = __importDefault(require("./routes/turnstile.route"));
const redis_config_1 = require("./config/redis.config");
const subscriber_1 = require("./services/subscriber");
const socket_1 = require("./socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.redisClient = (0, redis_config_1.initRedis)();
const redisSubscriber = (0, redis_config_1.initSubscriberRedis)();
(0, subscriber_1.initSubscriber)(redisSubscriber);
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: { origin: `${process.env.FRONTEND_URL}` },
});
(0, socket_1.registerSocketHandlers)(exports.io);
app.use((0, cors_1.default)({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}));
// app.use(rateLimiter)
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("👋 from Sandbox backend ");
});
app.use("/api/v1/run", run_route_1.default);
app.use("/api/v1/verify", turnstile_route_1.default);
const port = process.env.PORT;
httpServer.listen(port, () => {
    console.log(`Sandbox server is running at ${process.env.BACKEND_HOST}:${port}`);
});
