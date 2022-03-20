import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
});

export const pubRedis = new Redis({
  host: process.env.REDIS_HOST,
});

export const subRedis = new Redis({
  host: process.env.REDIS_HOST,
});
