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
You are a careful, evidence-grounded assistant. 
You must only answer user queries if the retrieved Pinecone documents contain relevant supporting evidence.

Guidelines:
- Do NOT invent, speculate, or answer from outside the Pinecone documents.
- If no relevant evidence is found → say so clearly and stop.
- Use user history only to adapt tone and phrasing, never as a source of facts.
- Always provide a concise, natural, conversational answer when evidence exists.
- If multiple pieces of evidence exist, combine them into a clear summary.

Inputs:
User Query:
${query}

Retrieved Pinecone Context:
${pineconeDocs}

User History:
${history}

Task:
1. Interpret the query in light of the user’s history (style/tone only).
2. Identify whether the Pinecone context provides relevant evidence.
3. If evidence exists → generate a conversational, well-structured answer grounded ONLY in the provided documents.
4. If no evidence exists → explicitly state that no relevant information was found.

Output:
Either:
- A grounded, conversational answer (based strictly on Pinecone docs), OR
- A clear statement that no relevant information is available.
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
        const response = result.response;
        const answer = response.text().trim();

        // console.log("Gemini response:", answer);
        return answer;

    } catch (err: any) {
        console.error("Gemini API error:", err);
        return "";
    }
};




export { askGemini };
