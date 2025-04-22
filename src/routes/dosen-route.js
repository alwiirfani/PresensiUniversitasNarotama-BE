import express from "express";
import { verifyTokenDosen } from "../middleware/auth-middleware.js";
import dosenController from "../controllers/dosen-controller.js";

const dosenRoute = express.Router();

dosenRoute.put("/api/v1/dosen", verifyTokenDosen, dosenController.updateDosen);

export { dosenRoute };
