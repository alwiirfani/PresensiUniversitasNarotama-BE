import express from "express";
import fakultasController from "../controllers/fakultas-controller.js";
import authController from "../controllers/auth-controller.js";

const publicRoute = express.Router();

// AUTHENTICATION
publicRoute.post("/api/v1/auth/admin-register", authController.registerAdmin);
publicRoute.post("/api/v1/auth/admin-login", authController.loginAdmin);
publicRoute.post("/api/v1/auth/mahasiswa-login", authController.loginMahasiswa);

// FAKULTAS
publicRoute.get("/api/v1/fakultas/:id", fakultasController.findFakultasById);
publicRoute.get("/api/v1/fakultas", fakultasController.findAllFakultas);

export { publicRoute };
