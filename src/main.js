import express from "express";
import "dotenv/config";
import cors from "cors";
import { logger, loggerInfo } from "./configs/logger.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./routes/admin-route.js";
import { publicRoute } from "./routes/public-route.js";
import { verifyRoute } from "./routes/verify-route.js";
import { dosenRoute } from "./routes/dosen-route.js";
import { mahasiswaRoute } from "./routes/mahasiswa-route.js";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend url
    credentials: true, // send cookies or jwt
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // allowed headers in request
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerInfo);

app.use(cookieParser());
app.use(adminRoute, dosenRoute, mahasiswaRoute, verifyRoute, publicRoute);

const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
