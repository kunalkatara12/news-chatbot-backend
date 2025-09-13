import { Router } from "express";
import chatRouter from "./chats.routes"
const router = Router();

router.use("/chat", chatRouter);

export default router;
