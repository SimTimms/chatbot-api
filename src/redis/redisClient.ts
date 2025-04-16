import { createClient } from "redis";

let redisClientInstance: ReturnType<typeof createClient> | null = null;

async function redisClient(
  connectionURL: string
): Promise<ReturnType<typeof createClient>> {
  if (!connectionURL) {
    throw new Error("Redis connection URL is not defined");
  }
  if (!redisClientInstance) {
    redisClientInstance = createClient({
      username: "default",
      password: "2el8eMzUAGV7Nq4KVoPufEgvzosC2lSX",
      socket: {
        host: connectionURL,
        port: 11240,
      },
    });

    redisClientInstance.on("error", (err) => {
      console.error("Redis error:", err.message);
    });

    redisClientInstance.on("ready", () => {
      console.log("Redis connected successfully");
    });

    try {
      await redisClientInstance.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw new Error("Redis connection failed");
    }
  }
  return redisClientInstance; // Return the Redis client instance
}

export default redisClient;
