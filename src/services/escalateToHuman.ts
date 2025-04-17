import logService from "./logs/createLogService";
import { LOG_TYPES } from "../types/enums";

import csEmailHandler from "../utils/csEmailHandler";

const noAnswerHandler = async (
  question: string,
  aiAnswer: string,
  sessionId: string
) => {
  csEmailHandler(sessionId);

  logService(
    process.env.LOG_API_URL as string,
    question,
    aiAnswer,
    sessionId,
    LOG_TYPES.NO_RESPONSE
  );
};

export default noAnswerHandler;
