import express from "express";
import { verifyToken } from "../middleware/auth-middleware.js";
import authController from "../controllers/auth-controller.js";
import dosenController from "../controllers/dosen-controller.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";

const verifyRoute = express.Router();

// AUTHENTICATION
verifyRoute.delete("/api/v1/auth/logout", verifyToken, authController.logout);

// DOSEN
verifyRoute.get(
  "/api/v1/dosen/:dosenNip",
  verifyToken,
  dosenController.findDosenByNip
);

// MAHASISWA
verifyRoute.get(
  "/api/v1/mahasiswa/:mahasiswaNim",
  verifyToken,
  mahasiswaController.findMahasiswaByNim
);

export { verifyRoute };
