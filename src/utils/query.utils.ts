import { getEmbeddings } from "@/config/jina.config";
import { index } from "@/config/pinecone.config";
import { QueryOptions, QueryResponse, RecordMetadata } from "@pinecone-database/pinecone";

const query = async (
    question: string,
    options?: QueryOptions
): Promise<QueryResponse<RecordMetadata>> => {
    console.log(question);

    const queryEmbeddings = await getEmbeddings(question);

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
