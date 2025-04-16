export const validateQuestion = (question: string) => {
  if (!question) {
    throw new Error("Question is not defined");
  }
  if (question.trim().length === 0) {
    throw new Error("Question is not defined");
  }
};

export const validateSessionId = (sessionId: string) => {
  if (!sessionId) {
    throw new Error("sessionId is not defined");
  }
};
