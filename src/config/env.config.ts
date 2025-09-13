import "dotenv/config";

interface Config {
    GEMINI_API: string;
    JINA_API: string;
    PINECONE_API: string;
    REDIS_URL: string;
    PORT: number;
}

const getConfig = (): Config => {
    const config: Partial<Config> = {
        GEMINI_API: process.env.GEMINI_API,
        JINA_API: process.env.JINA_API,
        PINECONE_API: process.env.PINECONE_API,
        REDIS_URL: process.env.REDIS_URL,
        PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    };

    for (const [key, value] of Object.entries(config)) {
        if (value === undefined || value === null || value === "") {
            throw new Error(`❌ Missing key ${key} in .env`);
        }
    }

    return config as Config;
};

const config = getConfig();
export default config;
