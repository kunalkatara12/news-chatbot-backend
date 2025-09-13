import Redis from "ioredis";
import config from "./env.config";

// Throw an error if the URL is not found to prevent fallback
if (!config.REDIS_URL) {
    throw new Error("🔴 REDIS_URL environment variable is not set.");
}

// Pass the Upstash URL to ioredis
const redisClient = new Redis(config.REDIS_URL);

// Add event listeners for better error handling
// redisClient.on("connect", () => {
//     console.log("🟢 Successfully connected to Upstash Redis!");
// });

// redisClient.on("error", (err) => {
//     console.error("❌ Upstash Redis connection error:", err.message);
// });

export { redisClient };