import createLogService from "./logs/createLogService";
import { LOG_TYPES } from "../types/enums";
import { setCachedData } from "../redis/helpers";
import escalateToHuman from "./escalateToHuman";
import handleRefund from "./handleRefund";

const CACHE_EXPIRATION = 3600;

const responseHandler = async (
  question: string,
  aiAnswer: string,
  sessionId: string,
  cacheKey: string,
  isCached: boolean
): Promise<string> => {
  let adjustedAiAnswer = aiAnswer;

  //Caching the AI answer if it's not cached
  if (!isCached) {
    await setCachedData(cacheKey, aiAnswer, CACHE_EXPIRATION);
  }
  console.log("Adjusted AI Answer:", adjustedAiAnswer);
  if (
    adjustedAiAnswer.indexOf(LOG_TYPES.ESCALATE) > -1 ||
    adjustedAiAnswer.indexOf(LOG_TYPES.NO_RESPONSE) > -1
  ) {
    adjustedAiAnswer = await escalateToHuman(question, aiAnswer, sessionId);
  } else if (adjustedAiAnswer.indexOf(LOG_TYPES.REFUND) > -1) {
    adjustedAiAnswer = await handleRefund(question, aiAnswer, sessionId);
  } else {
    createLogService(
      process.env.LOG_API_URL as string,
      question,
      aiAnswer,
      sessionId,
      isCached ? LOG_TYPES.CHAT_CACHED : LOG_TYPES.CHAT
    );
  }
  return adjustedAiAnswer;
};

export default responseHandler;
