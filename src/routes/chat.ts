import { Router, Request, Response } from "express";
import vellumChatResponse from "../services/vellumChatResponse";
import { validateQuestion } from "./validators";
import { getCachedData, setCachedData } from "../redis/helpers";

const chatRouter = Router();
const CACHE_EXPIRATION = 3600;
chatRouter.post("/ask", async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    validateQuestion(question);

    const cacheKey = `question-response:${question}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const answer = await vellumChatResponse(question);
    await setCachedData(cacheKey, JSON.stringify(answer), CACHE_EXPIRATION);
    return res.json({ answer });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default chatRouter;
