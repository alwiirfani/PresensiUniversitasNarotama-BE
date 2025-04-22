import express from "express";
import { verifyTokenMahasiswa } from "../middleware/auth-middleware.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";

const mahasiswaRoute = express.Router();

mahasiswaRoute.put(
  "/api/v1/mahasiswa",
  verifyTokenMahasiswa,
  mahasiswaController.updateMahasiswa
);

export { mahasiswaRoute };
