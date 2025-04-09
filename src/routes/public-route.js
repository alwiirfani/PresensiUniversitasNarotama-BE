import express from "express";
import fakultasController from "../controllers/fakultas-controller.js";

const publicRoute = express.Router();

// FAKULTAS
publicRoute.get("/api/v1/fakultas/:id", fakultasController.findFakultasById);

export { publicRoute };
