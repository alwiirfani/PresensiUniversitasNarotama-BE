import express from "express";
import fakultasController from "../controllers/fakultas-controller.js";

const adminRoute = express.Router();

adminRoute.post("/api/v1/fakultas", fakultasController.createFakultas);
adminRoute.put("/api/v1/fakultas", fakultasController.updateFakultas);
adminRoute.delete("/api/v1/fakultas/:id", fakultasController.deleteFakultas);

export { adminRoute };
