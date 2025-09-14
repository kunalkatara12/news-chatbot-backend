import { getEmbeddings } from "@/config/jina.config";
import { index } from "@/config/pinecone.config";
import { QueryOptions, QueryResponse, RecordMetadata } from "@pinecone-database/pinecone";

const query = async (
    question: string,
    options?: QueryOptions
): Promise<QueryResponse<RecordMetadata>> => {
    console.log(question);

    const queryEmbeddings = await getEmbeddings(question);
    // const cacheKey = `embedding:query:${question}`;
    // let queryEmbeddings: number[];

    // const cached = await redisClient.get(cacheKey);
    // if (cached) {
    //     queryEmbeddings = JSON.parse(cached);
    //     console.log("✅ Using cached embedding");
    // } else {
    //     queryEmbeddings = await getEmbeddings(question);
    //     await redisClient.set(cacheKey, JSON.stringify(queryEmbeddings), "EX", 3600); // 1h TTL
    //     console.log("❌ Not cached → fetched new embedding");
    // }

    const queryOptions: QueryOptions = {
        topK: options?.topK ?? 4,
        vector: queryEmbeddings,
        // filter: options?.filter ?? {},
        includeMetadata: options?.includeMetadata ?? true,
        includeValues: options?.includeValues ?? false,
    };

    const doc = await index.query(queryOptions);
    return doc;
};

export { query };
