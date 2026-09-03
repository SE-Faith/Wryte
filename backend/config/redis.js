import "dotenv/config";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

export const redisEnabled = Boolean(redisUrl);

const redisClient = createClient({
    url: redisUrl || "redis://localhost:6379"
});

redisClient.on("error", (error) => {
    console.error(`Redis error: ${error.message}`);
});

export const connectRedis = async () => {
    if (!redisEnabled || redisClient.isOpen) return false;

    try {
        await redisClient.connect();
        console.log("Redis connected successfully");
        return true;
    } catch (error) {
        console.warn(`Redis unavailable; continuing without Redis: ${error.message}`);
        return false;
    }
};

export const cacheGet = async (key) => {
    if (!redisEnabled || !redisClient.isReady) return null;

    try {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.warn(`Redis cache read failed: ${error.message}`);
        return null;
    }
};

export const cacheSet = async (key, value, ttlSeconds) => {
    if (!redisEnabled || !redisClient.isReady) return;

    try {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
        console.warn(`Redis cache write failed: ${error.message}`);
    }
};

export const invalidateCache = async (pattern) => {
    if (!redisEnabled || !redisClient.isReady) return;

    try {
        const keys = [];
        for await (const key of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
            keys.push(key);
        }
        if (keys.length > 0) await redisClient.del(keys);
    } catch (error) {
        console.warn(`Redis cache invalidation failed: ${error.message}`);
    }
};

export default redisClient;
