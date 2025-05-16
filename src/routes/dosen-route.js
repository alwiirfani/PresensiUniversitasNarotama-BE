import express from "express";
import { verifyTokenDosen } from "../middleware/auth-middleware.js";
import dosenController from "../controllers/dosen-controller.js";
import presensiMhsController from "../controllers/presensi-mhs-controller.js";

const dosenRoute = express.Router();

dosenRoute.put("/api/v1/dosen", verifyTokenDosen, dosenController.updateDosen);

// SCAN QRCODE MAHASISWA
dosenRoute.post(
  "/api/v1/presensi-mahasiswa/:jadwalMataKuliahId",
  verifyTokenDosen,
  presensiMhsController.scanQrCode
);

export { dosenRoute };
