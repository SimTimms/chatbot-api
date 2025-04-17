const createHTMLEmail = (
  summary: string,
  chatHistory: string,
  tag: string,
  suggestedAction: string,
  userEmail: string,
  cognitoAccountEmail: string,
  invoiceNumber: string,
  subject: string
) => {
  return `
  <b>Action Needed</b>
  <p>${suggestedAction}</p>
  <b>Escalation Details</b>
  <ul>
    <li><b>Tag:</b> ${tag}</li>
    <li><b>User reply-to email:</b> ${userEmail}</li>
    <li><b>Cognito account email:</b> ${cognitoAccountEmail}</li>
    <li><b>Invoice number:</b> ${invoiceNumber}</li>
    <li><b>Escalation reason:</b> ${subject}</li>
  </ul>
  <p>This email has been automatically generated by the AI Chatbot API (In development)</p>
  <b>Summary of Issue</b>
  <p>${summary}</p>
  <b>Full Conversation Log</b>
  <p>${chatHistory}</p>
  <p><b>Sent by:</b> Cognito Automated Support Bot</p>`;
};
export default createHTMLEmail;
