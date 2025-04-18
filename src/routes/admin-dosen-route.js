import express from "express";
import { verifyTokenAdminOrDosen } from "../middleware/auth-middleware.js";

const adminDosenRoute = express.Router();

export default adminDosenRoute;
