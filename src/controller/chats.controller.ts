import { askGemini, getEmbeddings } from "@/config";
import { query } from "@/utils";
import { getRedisHistory, resetRedisSession, saveMessage } from "@/services"
import { Request, Response } from "express";
const chat = async (req: Request, res: Response) => {
    try {
        const { id: sessionId } = req.params;
        const { query: question } = req.body;

        if (!question) return res.status(400).json({ error: "Query required" });

        // 1️⃣ Embed + Pinecone search
        const doc = await query(question);
        // console.log(`doc: ${JSON.stringify(doc)}`);

        // 2️⃣ Collect past history
        const history = await getRedisHistory(sessionId, -8);

        // console.log(`history: ${JSON.stringify(history)}`);
        // 3️⃣ Call Gemini
        const context = doc.matches?.map(m => m.metadata && m.metadata.text).join("\n\n") || "";
        // console.log(`context: ${context}`);
        const answer = await askGemini(question, context, history.map(h => h.text).join("\n"));
        // console.log(`answer: ${answer}`);

        // 4️⃣ Save to Redis
        await saveMessage(sessionId, "user", question);
        await saveMessage(sessionId, "bot", answer);

        // 5️⃣ Respond
        return res.json({
            data: {
                answer,
            },
        });

    } catch (err: any) {
        console.error("Chat error:", err.response?.data || err.message);
        res.status(500).json({ error: err });
    }
};
const getHistory = async (req: Request, res: Response) => {
    try {
        const { id: sessionId } = req.params;
        const history = await getRedisHistory(sessionId);
        res.json({ data: history });
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: err });
    }
}

const clearHistory = async (req: Request, res: Response) => {
    try {
        const { id: sessionId } = req.params;
        await resetRedisSession(sessionId);
        res.json({ message: "Chat history cleared" });
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: err });
    }
}

export { chat, getHistory, clearHistory }