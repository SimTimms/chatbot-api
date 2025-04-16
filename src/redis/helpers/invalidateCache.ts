import redisClient from "../redisClient";

const invalidateCache = async (key: string): Promise<void> => {
  if (!key) {
    throw new Error("Key is not defined");
  }
  const redis = await redisClient(
    process.env.REDIS_URI as string,
    process.env.REDIS_PASSWORD as string
  );
  await redis.del(key);
};

export default invalidateCache;
