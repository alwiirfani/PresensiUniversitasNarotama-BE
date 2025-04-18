import express from "express";
import fakultasController from "../controllers/fakultas-controller.js";
import authController from "../controllers/auth-controller.js";
import prodiController from "../controllers/prodi-controller.js";

const publicRoute = express.Router();

// AUTHENTICATION
publicRoute.post("/api/v1/auth/admin-register", authController.registerAdmin);
publicRoute.post("/api/v1/auth/admin-login", authController.loginAdmin);
publicRoute.post("/api/v1/auth/dosen-login", authController.loginDosen);
publicRoute.post("/api/v1/auth/mahasiswa-login", authController.loginMahasiswa);
publicRoute.get("/api/v1/auth/refresh-token", authController.refreshToken);

// FAKULTAS
publicRoute.get("/api/v1/fakultas/:id", fakultasController.findFakultasById);
publicRoute.get("/api/v1/fakultas", fakultasController.findAllFakultas);

// PRODI
publicRoute.get("/api/v1/prodi/:id", prodiController.findProdiById);
publicRoute.get("/api/v1/prodi", prodiController.findAllProdi);

export { publicRoute };
