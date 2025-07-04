import { createClient } from "redis"


export const initRedis = () => {
  const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  redisClient.connect();
  return redisClient;
}

export const initSubscriberRedis = () => {
  const subClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  subClient.on('error', (err) => console.error('Redis Subscriber Error', err));

  subClient.connect();
  return subClient;
}
