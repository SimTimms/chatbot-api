import { Router, Request, Response } from "express";
import { validateQuestion, validateSessionId } from "../validators";
import { getCachedData } from "../redis/helpers";
import cachedResponseHandler from "../services/cachedResponseHandler";
import uncachedResponseHandler from "../services/uncachedResponseHandler";
import getAiAnswer from "../services/ai/getAiAnswer";

const chatRouter = Router();

chatRouter.post("/ask", async (req: Request, res: Response) => {
  try {
    const { question, sessionId } = req.body;
    await validateQuestion(question);
    await validateSessionId(sessionId);

    //Cached Response
    const cacheKey = `question-response:${question}`;
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      cachedResponseHandler(question, cachedData, sessionId);
      return res.json(JSON.parse(cachedData));
    }

    //Uncached Response
    const aiAnswer: string = await getAiAnswer(question, sessionId);

    uncachedResponseHandler(question, aiAnswer, sessionId, aiAnswer, cacheKey);

    return res.json({ answer: aiAnswer });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default chatRouter;
