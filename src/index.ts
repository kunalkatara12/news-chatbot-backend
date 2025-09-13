import "module-alias/register";
import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import router from "@/router";
import { ingest } from "@/utils";
import { config } from "@/config";
// import { redisClient } from "@/config"

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = config.PORT || 3000;

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
