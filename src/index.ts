import "module-alias/register";
import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import router from "@/router";
import { config } from "@/config";
import cors from "cors";
// import { redisClient } from "@/config"

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174","https://news-chat.netlify.app/"], credentials: true }));
const port = process.env.PORT || 8985;
app.use("/api/v1", router);
app.get("/", async (_: Request, res: Response) => {
    // test connection
    // await redisClient.set("ping", "pong");
    // await redisClient.get("ping").then(console.log); // should print "pong"
    res.status(200).json({ message: "Server is running" });
});

// ingest();
app.listen(port, () => {
    console.clear();
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
