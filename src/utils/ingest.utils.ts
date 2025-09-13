import fs from "fs";
import pLimit from "p-limit"; // control concurrency
import { chunkText } from "./chunks.utils";
import { getEmbeddings, index } from "@/config";

const articles: { id: string; text: string }[] = JSON.parse(
    fs.readFileSync("news.json", "utf-8")
);

const BATCH_SIZE = 50;
const CONCURRENCY = 5;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getEmbeddingsWithRetry = async (chunk: string, attempt = 1): Promise<number[] | null> => {
    try {
        return await getEmbeddings(chunk);
    } catch (err: any) {
        if (attempt < MAX_RETRIES) {
            const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
            console.warn(
                `⚠️ Embedding failed (attempt ${attempt}) — retrying in ${delay}ms...`
            );
            await sleep(delay);
            return getEmbeddingsWithRetry(chunk, attempt + 1);
        }
        console.error(`❌ Embedding failed after ${MAX_RETRIES} attempts:`, err.message);
        return null;
    }
};

const processArticle = async (article: { id: string; text: string }) => {
    try {
        const chunks = chunkText(article.text, 1000);

        // Try embeddings with retry per chunk
        const embeddings = await Promise.all(
            chunks.map(async (chunk) => {
                const vector = await getEmbeddingsWithRetry(chunk);
                return vector ? { chunk, vector } : null;
            })
        );

        // Filter out failed chunks
        const validEmbeddings = embeddings.filter((e) => e !== null) as {
            chunk: string;
            vector: number[];
        }[];

        if (validEmbeddings.length === 0) {
            console.warn(`⚠️ Article ${article.id} has no valid chunks.`);
            return;
        }

        // Upload in batches
        for (let i = 0; i < validEmbeddings.length; i += BATCH_SIZE) {
            const batch = validEmbeddings.slice(i, i + BATCH_SIZE).map((item, idx) => ({
                id: `${article.id}-${i + idx}`, // continuous IDs
                values: item.vector,
                metadata: {
                    text: item.chunk,
                    source: article.id,
                },
            }));

            await index.upsert(batch);
        }

        console.log(
            `✅ Uploaded article ${article.id} (${validEmbeddings.length}/${chunks.length} chunks)`
        );
    } catch (err: any) {
        console.error(`❌ Error processing article ${article.id}:`, err.message);
    }
};

const ingest = async () => {
    console.log("📥 Starting ingestion of", articles.length, "articles...");

    const limit = pLimit(CONCURRENCY);
    await Promise.all(articles.map((article) => limit(() => processArticle(article))));

    console.log("🎉 Ingestion completed!");
};

export { ingest };
