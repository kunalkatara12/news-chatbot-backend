# News Chatbot Backend

This is the backend for a conversational AI chatbot that answers questions based on a curated set of news articles. It leverages retrieval-augmented generation (RAG) to provide relevant and context-aware responses.

---

## Features

-   **Chat with News Articles:** Engage in a conversation with a chatbot that has knowledge of the provided news articles.
-   **Session Management:** Maintains conversation history for each user session.
-   **Scalable Architecture:** Built with Node.js and Express for a robust and scalable backend.
-   **Vector Search:** Utilizes Pinecone for efficient similarity search to find relevant article snippets.
-   **LLM Integration:** Powered by Google's Gemini for natural language understanding and generation.

---

## Tech Stack

-   **Backend:** Node.js, Express, TypeScript
-   **Database:** Redis for session storage
-   **Vector Database:** Pinecone
-   **LLM:** Google Gemini
-   **Embeddings:** Jina AI
-   **Dependencies:**
    -   `axios`: For making HTTP requests to external APIs.
    -   `cheerio`: For web scraping to fetch news articles.
    -   `cors`: To enable Cross-Origin Resource Sharing.
    -   `dotenv`: For managing environment variables.
    -   `ioredis`: A Redis client for Node.js.
    -   `module-alias`: To create aliases for module imports.
    -   `p-limit`: To limit concurrency of promises.
    -   `xml2js`: To parse XML feeds.

---

## Installation Instructions

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn
* Access to Pinecone, Google Gemini, Jina AI, and Redis with corresponding API keys and URLs.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables with your credentials:

    ```env
    GEMINI_API=<Your_Google_Gemini_API_Key>
    JINA_API=<Your_Jina_AI_API_Key>
    PINECONE_API=<Your_Pinecone_API_Key>
    REDIS_URL=<Your_Redis_URL>
    PORT=8985
    ```

---

## Usage

1.  **Build the project:**
    ```bash
    npm run build
    ```

2.  **Start the server:**
    ```bash
    npm start
    ```

3.  For development with auto-reloading:
    ```bash
    npm run dev
    ```

The server will be running at `http://localhost:8985`.

---

## Folder Structure
```graphql

backend/
├── dist/                     # Compiled JavaScript files
├── node_modules/             # Node.js modules
├── src/                      # TypeScript source code
│   ├── config/               # Configuration for external services (Gemini, Jina, Pinecone, Redis)
│   ├── controller/           # Express route handlers
│   ├── router/               # Express routes
│   ├── services/             # Business logic for services like Redis
│   ├── utils/                # Utility functions (data fetching, ingestion, querying)
│   ├── index.ts              # Main application entry point
├── .gitignore                # Files and folders to be ignored by Git
├── hindu-articles.json       # Scraped news articles
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript compiler options

```
---
