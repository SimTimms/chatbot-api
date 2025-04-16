/**
 * Validates the provided question string.
 *
 * @param question - The question to validate.
 * @throws {Error} Throws an error if the question is not defined.
 */
export const validateQuestion = (question: string) => {
  if (!question) {
    throw new Error("Question is not defined");
  }
};
