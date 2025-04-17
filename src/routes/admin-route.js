import express from "express";
import fakultasController from "../controllers/fakultas-controller.js";
import prodiController from "../controllers/prodi-controller.js";
import { verifyTokenAdmin } from "../middleware/auth-middleware.js";
import authController from "../controllers/auth-controller.js";

const adminRoute = express.Router();

// AUTHENTICATION
adminRoute.post(
  "/api/v1/auth/mahasiswa-register",
  verifyTokenAdmin,
  authController.registerMahasiswa
);

// FAKULTAS
adminRoute.post(
  "/api/v1/fakultas",
  verifyTokenAdmin,
  fakultasController.createFakultas
);
adminRoute.put(
  "/api/v1/fakultas",
  verifyTokenAdmin,
  fakultasController.updateFakultas
);
adminRoute.delete(
  "/api/v1/fakultas/:id",
  verifyTokenAdmin,
  fakultasController.deleteFakultas
);

// PRODI
adminRoute.post("/api/v1/prodi", verifyTokenAdmin, prodiController.createProdi);

export { adminRoute };
