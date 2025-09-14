import { redisClient } from "@/config"
// Save message (append to chat history)
export const saveMessage = async (sessionId: string, role: "user" | "bot", text: string) => {
    await redisClient.rpush(
        `session:${sessionId}`,
        JSON.stringify({ role, text })
    );
    await redisClient.expire(`session:${sessionId}`, 86400); // 24h TTL
}

// Get full chat history
export const getRedisHistory = async (sessionId: string, start?: number, end?: number) => {
    const history = await redisClient.lrange(`session:${sessionId}`, start || 0, end || -1);
    if (!history.length) return [];
    return history.map((h) => JSON.parse(h));
}

// Reset chat session
export const resetRedisSession = async (sessionId: string) => {
    await redisClient.del(`session:${sessionId}`);
}
// Delete all sessions (for development/testing)
export const deleteAllSessions = async (userId: string) => {
    const keys = await redisClient.keys(`session:${userId}:*`);
    console.log(keys);
    if (!keys.length) return;
    await redisClient.del(keys);
}
