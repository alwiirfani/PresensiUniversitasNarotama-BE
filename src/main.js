import express from "express";
import "dotenv/config";
import cors from "cors";
import { logger, loggerInfo } from "./configs/logger.js";
import { adminRoute } from "./routes/admin-route.js";
import { publicRoute } from "./routes/public-route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerInfo);

app.use(adminRoute, publicRoute);

const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
