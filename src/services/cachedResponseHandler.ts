import createLogService from "./logs/createLogService";
import { LOG_TYPES } from "../types/enums";
import noAnswerHandler from "./escalateToHuman";

const cachedResponseHandler = (
  question: string,
  aiResponse: string,
  sessionId: string
) => {
  if (aiResponse.indexOf(LOG_TYPES.NO_RESPONSE) > -1) {
    noAnswerHandler(question, aiResponse, sessionId);
  } else {
    createLogService(
      process.env.LOG_API_URL as string,
      question,
      aiResponse,
      sessionId,
      LOG_TYPES.CHAT_CACHED
    );
  }
};

export default cachedResponseHandler;
