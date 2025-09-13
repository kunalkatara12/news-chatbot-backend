const chunkText = (text: string, chunkSize = 500, overlap = 50) => {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        const chunk = text.slice(start, end);
        chunks.push(chunk);

        // move the pointer forward but keep overlap
        start += chunkSize - overlap;
    }

    return chunks;
}
export {chunkText}
