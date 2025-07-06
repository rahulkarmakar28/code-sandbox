"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const index_1 = require("../index");
const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 7;
const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const key = `rl:${ip}`;
        const [count, ttl] = await index_1.redisClient
            .multi()
            .incr(key)
            .ttl(key)
            .exec()
            .then((res) => {
            if (!res || !Array.isArray(res) || res.length < 2) {
                throw new Error('Redis response is null or malformed');
            }
            const incrRes = res[0];
            const ttlRes = res[1];
            if (incrRes[0] || ttlRes[0]) {
                throw incrRes[0] || ttlRes[0];
            }
            return [incrRes[1], ttlRes[1]];
        });
        if (count === 1) {
            await index_1.redisClient.expire(key, WINDOW_SECONDS);
        }
        if (count > MAX_REQUESTS) {
            // console.log(count)
            return res.status(429).json({
                error: `Rate limit exceeded. Try again in ${ttl} seconds`,
            });
        }
        next();
    }
    catch (err) {
        console.error('Redis rate limiter error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.rateLimiter = rateLimiter;
