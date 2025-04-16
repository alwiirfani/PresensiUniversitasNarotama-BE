import express from "express";
import "dotenv/config";
import cors from "cors";
import { logger, loggerInfo } from "./configs/logger.js";
import { adminRoute } from "./routes/admin-route.js";
import { publicRoute } from "./routes/public-route.js";
import verifyRoute from "./routes/verify-route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerInfo);

app.use(cookieParser());
app.use(adminRoute, verifyRoute, publicRoute);

const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
