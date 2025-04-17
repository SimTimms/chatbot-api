import createLogService from "./logs/createLogService";
import { LOG_TYPES } from "../types/enums";
import { setCachedData } from "../redis/helpers";
import noAnswerHandler from "./escalateToHuman";

const CACHE_EXPIRATION = 3600;

const uncachedResponseHandler = async (
  question: string,
  aiResponse: string,
  sessionId: string,
  answer: string,
  cacheKey: string
) => {
  await setCachedData(cacheKey, answer, CACHE_EXPIRATION);
  if (aiResponse.indexOf(LOG_TYPES.NO_RESPONSE) > -1) {
    noAnswerHandler(question, aiResponse, sessionId);
  } else {
    createLogService(
      process.env.LOG_API_URL as string,
      question,
      aiResponse,
      sessionId,
      LOG_TYPES.CHAT
    );
  }
};

export default uncachedResponseHandler;
