import logService from "./logs/createLogService";
import { LOG_TYPES } from "../types/enums";

const cachedResponseHandler = (
  question: string,
  aiResponse: string,
  sessionId: string
) => {
  logService(
    process.env.LOG_API_URL as string,
    question,
    aiResponse,
    sessionId,
    LOG_TYPES.CHAT_CACHED
  );
};

export default cachedResponseHandler;
