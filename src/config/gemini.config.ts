import { GoogleGenerativeAI } from "@google/generative-ai"
import config from "./env.config";

const geminiApiKey = config.GEMINI_API;
if (!geminiApiKey) {
    throw new Error("Missing GEMINI_API environment variable");
}

// 1. Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(geminiApiKey);

// 2. Get the specific generative model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


/**
 * Prompt template for Gemini (This remains unchanged)
 */
const prompt = (query: string, pineconeDocs: string, history: string) => `
You are an intelligent assistant that answers user queries only if supporting evidence exists in the retrieved Pinecone documents.

- If the documents do not provide relevant information, tell clearly .
- Never invent or speculate beyond the provided documents.
- If history is given, use it only to personalize phrasing, but still ground answers strictly in documents.

Input:

User Query:
${query}

Retrieved Context (from Pinecone):
${pineconeDocs}

User History:
${history}

Task:
- Interpret the query in light of history.
- Search Pinecone results for supporting evidence.
- If evidence exists → generate a natural, conversational answer.
- If no evidence exists → tell clearly .

Output:
Either:
- A context-grounded, conversational answer.
`;


/**
 * Ask Gemini with query, Pinecone results, and history using the GenAI SDK
 */
const askGemini = async (
    query: string,
    pineConeRes: string,
    history: string
): Promise<string> => {
    try {
        // Build the full prompt using your template function
        const fullPrompt = prompt(query, pineConeRes, history);
        // console.log("Prompt:", fullPrompt);

        // 3. Generate content using the SDK
        const result = await model.generateContent(fullPrompt);

        // 4. Access the response text directly
        const response = await result.response;
        const answer = response.text().trim();

        // console.log("Gemini response:", answer);
        return answer;

    } catch (err: any) {
        console.error("Gemini API error:", err);
        return "";
    }
};




export { askGemini };
