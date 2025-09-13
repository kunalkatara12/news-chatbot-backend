import axios, { AxiosResponse } from "axios";
import config from "./env.config";
// Define a type for the embedding data
interface EmbeddingResponse {
    data: {
        object: string;
        embedding: number[];
        index: number;
    }[];
    model: string;
    object: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}

const getEmbeddings = async (text: string): Promise<number[]> => {
    const jinaUrl = "https://api.jina.ai/v1/embeddings";
    const model = "jina-embeddings-v4";
    const dimensions = 1024;

    // Ensure API key is available
    if (!config.JINA_API) {
        throw new Error("JINA_API environment variable is not set.");
    }

    const configuration = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.JINA_API}`
        }
    };

    const payload = {
        model, task: "retrieval.query",
        input: [{ text }], dimensions
    };

    try {
        const response: AxiosResponse<EmbeddingResponse> = await axios.post(jinaUrl, payload, configuration);
        return response.data.data[0].embedding;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error fetching embeddings:", error.message);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
        } else {
            console.error("An unexpected error occurred:", error);
        }
        throw error;
    }
};

export { getEmbeddings };