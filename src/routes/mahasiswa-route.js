import express from "express";
import { verifyToken } from "../middleware/auth-middleware";

const mahasiswaRoute = express.Router();

mahasiswaRoute.post("/mahasiswa/login", verifyToken);

export default mahasiswaRoute;
