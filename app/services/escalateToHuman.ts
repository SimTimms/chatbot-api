import createLogService from './logs/createLogService';
import { LOG_TYPES } from '../types/enums';
import csEmailHandler from '../utils/csEmailHandler';

const escalateToHuman = async (
  question: string,
  aiAnswer: string,
  sessionId: string
): Promise<string> => {
  let adjustedAiAnswer = aiAnswer;
  adjustedAiAnswer = `I've sent this to our support team, and they'll get back to you soon. <br/>In the meantime, if you have any other questions, feel free to ask!`;

  await createLogService(
    process.env.LOG_API_URL as string,
    question,
    adjustedAiAnswer,
    sessionId,
    LOG_TYPES.ESCALATE
  );

  //REQUIRES A CHECK TO SEE IF AN EMAIL HAS ALREADY BEEN SENT - THIS WILL PREVENT THE EMAIL FROM BEING SPAMMED

  try {
    const emailConfig = {
      sessionId: sessionId,
      userEmail: '',
      cognitoAccountEmail: '',
      invoiceNumber: '',
    };
    setImmediate(() => csEmailHandler(emailConfig));
  } catch (error) {
    return adjustedAiAnswer;
  }

  return adjustedAiAnswer;
};

export default escalateToHuman;
