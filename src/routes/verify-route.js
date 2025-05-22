import express from "express";
import { verifyToken } from "../middleware/auth-middleware.js";
import authController from "../controllers/auth-controller.js";
import dosenController from "../controllers/dosen-controller.js";

const verifyRoute = express.Router();

// AUTHENTICATION
verifyRoute.delete(
  "/api/v1/auth/logout/:accessToken",
  verifyToken,
  authController.logout
);

// DOSEN
verifyRoute.get(
  "/api/v1/dosen/:dosenNip",
  verifyToken,
  dosenController.findDosenByNip
);

export { verifyRoute };
