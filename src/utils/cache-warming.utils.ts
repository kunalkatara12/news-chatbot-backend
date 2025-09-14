import { getEmbeddings, redisClient } from "@/config";
import fs from "fs";
export const cacheWarming = async () => {
    console.log("Cache warming initiated");
    const articles=fs.readFileSync("hindu-articles.json", "utf-8");
    const parsedArticles:{id:string;text:string}[]=JSON.parse(articles);
    for (const article of parsedArticles) {
        const cacheKey = `embedding:${article.id}`;
        const exists = await redisClient.exists(cacheKey);

        if (!exists) {
            const embedding = await getEmbeddings(article.text);
            await redisClient.set(cacheKey, JSON.stringify(embedding), "EX", 43200); // 12h TTL
            console.log(`Cached embedding for ${article.text.substring(0, 30)}...`);
        }
    }
    console.log("Cache warming completed");
    return;
}