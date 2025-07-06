"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSubscriberRedis = exports.initRedis = void 0;
const redis_1 = require("redis");
const initRedis = () => {
    const redisClient = (0, redis_1.createClient)({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.connect();
    return redisClient;
};
exports.initRedis = initRedis;
const initSubscriberRedis = () => {
    const subClient = (0, redis_1.createClient)({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    subClient.on('error', (err) => console.error('Redis Subscriber Error', err));
    subClient.connect();
    return subClient;
};
exports.initSubscriberRedis = initSubscriberRedis;
