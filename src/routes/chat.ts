import { Router, Request, Response } from "express";
import vellumChatResponse from "../services/vellumChatResponse";

const chatRouter = Router();

chatRouter.post("/ask", async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await vellumChatResponse(question);

    console.log("checkDocumentsResult", answer);
    return res.json({ answer });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default chatRouter;
