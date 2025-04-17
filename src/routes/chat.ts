import { Router } from "express";
import { validateRequest } from "../validators/";
import handleValidationErrors from "../middleware/handleValidationErrors";
import askQuestion from "../controllers/askQuestion";

const chatRouter = Router();

chatRouter.post("/ask", validateRequest, handleValidationErrors, askQuestion);

export default chatRouter;
