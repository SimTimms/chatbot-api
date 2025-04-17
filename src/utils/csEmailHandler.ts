import sendEmail from "../services/mailjet/sendEmail";
import { MailjetSendEmail } from "../types";
import createHTMLEmail from "../utils/createHTMLEmail";
import vellumSummariseChat from "../services/vellum/vellumSummariseChat";
import vellumSummariseSubject from "../services/vellum/vellumSummariseSubject";
import getChatHistory from "../services/logs/getChatHistory";
import chatHistoryToString from "../utils/chatHistoryToString";

const csEmailHandler = async (sessionId: string) => {
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
  const aiSubjectJSON = JSON.parse(aiSummarySubject[0].value as string);
  const aiSubject = aiSubjectJSON.subject;
  const aiTag = aiSubjectJSON.tag;
  const aiAction = aiSubjectJSON.action;

  //Create an HTML version
  const chatHistoryHTML = chatHistoryString.replace(/\n/g, "<br/>");

  //Create the email object
  const csEmail: MailjetSendEmail = {
    subject: `[SUPPORT ESCALATION] - ${aiTag} - ${aiSubject} - from {User Email}`,
    htmlMessage: "",
    message: "",
    recipientEmail: process.env.MAILJET_CUSTOMER_SUPPORT_EMAIL as string,
    recipientName: "support@cognitoedu.org",
    senderEmail: process.env.MAILJET_SENDER_EMAIL as string,
    senderName: "chatbot@cognitoedu.org",
    mailjetKey: process.env.MAILJET_API_KEY as string,
    mailjetSecret: process.env.MAILJET_API_SECRET as string,
  };
  csEmail.message = `${aiSummary}/n${chatHistoryString}`;
  csEmail.htmlMessage = createHTMLEmail(
    aiSummary,
    chatHistoryHTML,
    aiTag,
    aiAction,
    "{User Email}",
    "{Cognito Account Email}",
    "{Invoice Number}",
    aiSubject
  );

  sendEmail(csEmail);
};

export default csEmailHandler;
