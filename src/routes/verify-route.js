import express from "express";
import { verifyToken } from "../middleware/auth-middleware.js";

const verifyRoute = express.Router();

export default verifyRoute;
