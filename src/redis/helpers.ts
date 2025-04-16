import redisClient from "./redisClient";

const getCachedData = async (key: string): Promise<string | null> => {
  if (!key) {
    throw new Error("Key is not defined");
  }
  const redis = await redisClient(process.env.REDIS_URI as string);
  return await redis.get(key);
};

const setCachedData = async (
  key: string,
  value: string,
  ttl: number
): Promise<void> => {
  if (!key || !value || !ttl) {
    throw new Error("Key, value or ttl not defined");
  }
  const redis = await redisClient(process.env.REDIS_URI as string);
  await redis.set(key, value, { EX: ttl }); // EX: sets the expiration time in seconds
};

const invalidateCache = async (key: string): Promise<void> => {
  if (!key) {
    throw new Error("Key is not defined");
  }
  const redis = await redisClient(process.env.REDIS_URI as string);
  await redis.del(key);
};

export { getCachedData, setCachedData, invalidateCache };
