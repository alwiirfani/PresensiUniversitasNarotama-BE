import express from "express";
import { verifyTokenMahasiswa } from "../middleware/auth-middleware.js";

const mahasiswaRoute = express.Router();

export default mahasiswaRoute;
