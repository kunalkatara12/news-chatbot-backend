import axios from "axios";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";
import fs from "fs";

const rssUrl = "https://feeds.bbci.co.uk/news/health/rss.xml";

const fetchRSS = async (rssUrl: string): Promise<string[]> => {
    const { data } = await axios.get(rssUrl);
    const parsed = await parseStringPromise(data);

    const items = parsed.rss.channel[0].item;
    const urls = items.map((item: any) => item.link[0]);
    return urls;
};

const fetchArticles = async () => {
    console.log("Fetching RSS feed...");
    const urls = await fetchRSS(rssUrl);
    console.log("Found", urls.length, "URLs");

    const articles: { id: string; text: string }[] = [];
    let count = 0;

    for (let i = 0; i < urls.length && count < 50; i++) {
        try {
            const { data: html } = await axios.get(urls[i]);
            const $ = cheerio.load(html);

            const title = $("h1").first().text().trim() || $("title").text().trim();

            const body = $("p")
                .map((_, el) => $(el).text().trim())
                .get()
                .join(" ");

            if (body.length > 200) {
                count++;
                articles.push({ id: `bbc-${count}`, text: `${title}. ${body}` });
                console.log("✅ Added:", title);
            } else {
                console.log("⚠️ Skipped short article:", urls[i]);
            }
        } catch (err: any) {
            console.error("❌ Error fetching", urls[i], err.message);
        }
    }

    fs.writeFileSync("news.json", JSON.stringify(articles, null, 2), "utf-8");
    console.log("📄 Saved", articles.length, "articles to news.json");
};


export { fetchArticles };
