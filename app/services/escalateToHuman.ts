import createLogService from './logs/createLogService';
import { LOG_TYPES } from '../types/enums';
import csEmailHandler, { EmailInput } from '../utils/csEmailHandler';
import vellumSummariseChat from '../services/vellum/vellumSummariseChat';
import vellumSummariseSubject from '../services/vellum/vellumSummariseSubject';
import getChatHistory from '../services/logs/getChatHistory';
import chatHistoryToString from '../utils/chatHistoryToString';

const escalateToHuman = async (
  question: string,
  aiAnswer: string,
  sessionId: string
): Promise<string> => {
  let adjustedAiAnswer = aiAnswer;
  adjustedAiAnswer = `Sorry, I can't help with that. I've sent this to our support team, and they'll get back to you soon. <br/>In the meantime, if you have any other questions, feel free to ask!`;

  await createLogService(
    process.env.LOG_API_URL as string,
    question,
    adjustedAiAnswer,
    sessionId,
    LOG_TYPES.ESCALATE
  );

  //Get Chat History
  const chatHistory = await getChatHistory(
    process.env.LOG_API_URL as string,
    sessionId
  );
  const chatHistoryString = chatHistoryToString(chatHistory);

  //Get AI to summarise the chat history and subject
  const aiSummarisedHistory = await vellumSummariseChat(chatHistoryString);
  const aiSummary = aiSummarisedHistory[0].value as string;
  const aiSummarySubject = await vellumSummariseSubject(aiSummary);
  try {
    const aiSubjectJSON = JSON.parse(aiSummarySubject[0].value as string);
    const aiSubject = aiSubjectJSON.subject;
    const aiTag = aiSubjectJSON.tag;
    const aiAction = aiSubjectJSON.action;

    const emailConfig: EmailInput = {
      aiSubject,
      aiTag,
      aiAction,
      aiSummary,
      chatHistoryString,
    };

    setImmediate(() => csEmailHandler(emailConfig));
  } catch (error) {
    return adjustedAiAnswer;
  }

  return adjustedAiAnswer;
};

export default escalateToHuman;
