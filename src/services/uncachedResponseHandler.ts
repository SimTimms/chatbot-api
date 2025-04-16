import logService from "./logs/createLogService";
import { LOG_TYPES } from "../types/enums";
import { setCachedData } from "../redis/helpers";
const CACHE_EXPIRATION = 3600;

const uncachedResponseHandler = async (
  question: string,
  aiResponse: string,
  sessionId: string,
  answer: string,
  cacheKey: string
) => {
  await setCachedData(cacheKey, JSON.stringify(answer), CACHE_EXPIRATION);
  logService(
    process.env.LOG_API_URL as string,
    question,
    aiResponse,
    sessionId,
    LOG_TYPES.CHAT
  );
};

export default uncachedResponseHandler;
