import sendEmail from "../services/mailjet/sendEmail";
import { MailjetSendEmail } from "../types";
import createHTMLEmail from "../utils/createHTMLEmail";

export interface EmailInput {
  aiSubject: string;
  aiTag: string;
  aiAction: string;
  aiSummary: string;
  chatHistoryString: string;
  userEmail?: string;
  cognitoAccountEmail?: string;
  invoiceNumber?: string;
}

const csEmailHandler = async ({
  aiSubject,
  aiTag,
  aiAction,
  aiSummary,
  chatHistoryString,
  userEmail,
  cognitoAccountEmail,
  invoiceNumber,
}: EmailInput) => {
  const chatHistoryHTML = chatHistoryString.replace(/\n/g, "<br/>");

  // Create the email object
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

  csEmail.message = `${aiSummary}\n${chatHistoryString}`;
  csEmail.htmlMessage = createHTMLEmail(
    aiSummary,
    chatHistoryHTML,
    aiTag,
    aiAction,
    userEmail || "",
    cognitoAccountEmail || "",
    invoiceNumber || "",
    aiSubject
  );

  // Run email sending asynchronously without blocking the execution
  setImmediate(() => sendEmail(csEmail));
};

export default csEmailHandler;
