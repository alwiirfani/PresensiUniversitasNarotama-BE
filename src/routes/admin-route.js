import express from "express";
import fakultasController from "../controllers/fakultas-controller.js";
import prodiController from "../controllers/prodi-controller.js";

const adminRoute = express.Router();

// FAKULTAS
adminRoute.post("/api/v1/fakultas", fakultasController.createFakultas);
adminRoute.put("/api/v1/fakultas", fakultasController.updateFakultas);
adminRoute.delete("/api/v1/fakultas/:id", fakultasController.deleteFakultas);

// PRODI
adminRoute.post("/api/v1/prodi", prodiController.createProdi);
export { adminRoute };
