import { Pinecone } from '@pinecone-database/pinecone';
import config from './env.config';
const pc = new Pinecone({ apiKey: config.PINECONE_API! });
const indexName = "news-chatbot";
// pc.listIndexes().then(console.log);
const index = pc.Index(indexName);

export { pc, index };