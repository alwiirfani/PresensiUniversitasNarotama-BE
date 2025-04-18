import express from "express";
import { verifyTokenAdminOrMahasiswa } from "../middleware/auth-middleware.js";

const adminMahasiswaRoute = express.Router();

export default adminMahasiswaRoute;
