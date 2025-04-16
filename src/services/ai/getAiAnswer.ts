import vellumChatResponse from "../vellum/vellumChatResponse";
import getChatHistory from "../logs/getChatHistory";

const getAiAnswer = async (
  question: string,
  sessionId: string
): Promise<string> => {
  const chatHistory = await getChatHistory(
    process.env.LOG_API_URL as string,
    sessionId
  );

  //TODO - Add the chat history to the prompt
  console.log("Chat history:", chatHistory);

  const aiAnswer = await vellumChatResponse(question).catch((error) => {
    console.error("Error in vellumChatResponse:", error);
    return "Error in vellumChatResponse";
  });

  const reducedAnswer =
    aiAnswer.length > 0 && typeof aiAnswer[0] !== "string"
      ? String(aiAnswer[0].value)
      : "";

  return reducedAnswer;
};

export default getAiAnswer;
