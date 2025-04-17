import { Request, Response, NextFunction } from "express";
import { getCachedData } from "../redis/helpers";
import cachedResponseHandler from "../services/cachedResponseHandler";
import uncachedResponseHandler from "../services/uncachedResponseHandler";
import getAiAnswer from "../services/ai/getAiAnswer";

interface AskQuestionRequest extends Request {
  body: {
    question: string;
    sessionId: string;
  };
}

const askQuestion = async (
  req: AskQuestionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, sessionId } = req.body;
    //Cached Response
    const cacheKey = `question-response:${question}`;
    const cachedAnswer = await getCachedData(cacheKey);

    if (cachedAnswer) {
      cachedResponseHandler(question, cachedAnswer, sessionId);
      return res.json(JSON.parse(cachedAnswer));
    }

    //Uncached Response
    const aiAnswer: string = await getAiAnswer(question);
    uncachedResponseHandler(question, aiAnswer, sessionId, aiAnswer, cacheKey);
    return res.json({ answer: aiAnswer });
  } catch (error) {
    next(error);
  }
};

export default askQuestion;
