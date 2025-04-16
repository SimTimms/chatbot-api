import { Router, Request, Response } from "express";
import vellum from "../services/vellum";
import checkDocuments from "../services/checkDocuments";

const chatRouter = Router();

chatRouter.post("/ask", async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await vellum(question);
    const checkDocumentsResult = await checkDocuments(question);

    console.log("checkDocumentsResult", checkDocumentsResult);
    return res.json({ answer });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default chatRouter;
