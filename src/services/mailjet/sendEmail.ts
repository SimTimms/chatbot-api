import Mailjet from "node-mailjet";
import { MailjetSendEmail } from "../../types/";

const sendEmail = async ({
  subject,
  htmlMessage,
  message,
  recipientEmail,
  recipientName,
  senderEmail,
  senderName,
  mailjetKey,
  mailjetSecret,
}: MailjetSendEmail): Promise<void> => {
  const mailjet = Mailjet.apiConnect(mailjetKey || "", mailjetSecret || "");

  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName,
          },
          To: [
            {
              Email: recipientEmail,
              Name: recipientName,
            },
          ],
          Subject: subject,
          TextPart: message,
          HTMLPart: htmlMessage,
        },
      ],
    });

    request.catch((err) => {
      console.log(err.statusCode);
    });
  } catch (error) {
    console.warn("Failed to send email", error);
    return;
  }
};

export default sendEmail;
