import { Request, Response, NextFunction } from 'express';
import { getCachedData } from '../redis/helpers';
import responseHandler from '../services/responseHandler';
import getAiAnswer from '../services/ai/getAiAnswer';

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
    const cacheKey = `question-response:${question}-${sessionId}`;
    const cachedAnswer = await getCachedData(cacheKey);
    let adjustedResponse: string | undefined = undefined;
    if (cachedAnswer) {
      adjustedResponse = await responseHandler(
        question,
        cachedAnswer,
        sessionId,
        cacheKey,
        true
      );
      return res.json({ answer: adjustedResponse });
    }

    //Uncached Response
    const aiAnswer: string = await getAiAnswer(question);
    console.log(aiAnswer);
    adjustedResponse = await responseHandler(
      question,
      aiAnswer,
      sessionId,
      cacheKey,
      false
    );
    return res.json({ answer: adjustedResponse });
  } catch (error) {
    next(error);
  }
};

export default askQuestion;
