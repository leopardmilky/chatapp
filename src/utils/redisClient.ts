import { createClient } from 'redis';

export const redisConnection = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})
redisConnection.on('error', err => console.log('Redis Client Error!!', err));
redisConnection.connect();