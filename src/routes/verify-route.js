import express from "express";
import { verifyToken } from "../middleware/auth-middleware.js";
import authController from "../controllers/auth-controller.js";

const verifyRoute = express.Router();

verifyRoute.get(
  "/api/v1/auth/refresh-token",
  verifyToken,
  authController.refreshToken
);

export default verifyRoute;
