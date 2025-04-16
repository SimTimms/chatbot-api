import redisClient from "../redisClient";

const getCachedData = async (key: string): Promise<string | null> => {
  if (!key) {
    throw new Error("Key is not defined");
  }
  const redis = await redisClient(
    process.env.REDIS_URI as string,
    process.env.REDIS_PASSWORD as string
  );
  return await redis.get(key);
};

export default getCachedData;
