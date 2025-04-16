import redisClient from "../redisClient";

const setCachedData = async (
  key: string,
  value: string,
  ttl: number
): Promise<void> => {
  if (!key || !value || !ttl) {
    throw new Error("Key, value or ttl not defined");
  }
  const redis = await redisClient(
    process.env.REDIS_URI as string,
    process.env.REDIS_PASSWORD as string
  );
  await redis.set(key, value, { EX: ttl }); // EX: sets the expiration time in seconds
};

export default setCachedData;
