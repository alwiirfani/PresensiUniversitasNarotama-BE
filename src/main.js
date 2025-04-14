import express from "express";
import "dotenv/config";
import cors from "cors";
import { logger, loggerInfo } from "./configs/logger.js";
import { adminRoute } from "./routes/admin-route.js";
import { publicRoute } from "./routes/public-route.js";
import serverless from "serverless-http";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerInfo);

app.use(adminRoute, publicRoute);

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.SERVER_PORT, () => {
    logger.info(`Server running on port ${process.env.SERVER_PORT}`);
  });
}

export const handler = serverless(app);
