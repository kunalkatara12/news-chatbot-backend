import { Router } from "express";
import { chat, getHistory, clearHistory } from "@/controller"
const chatRouter = Router();

chatRouter.post("/:id", chat);
chatRouter.get("/:id", getHistory)
chatRouter.delete("/:id", clearHistory)
export default chatRouter;