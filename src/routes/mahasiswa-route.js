import express from "express";
import { verifyTokenMahasiswa } from "../middleware/auth-middleware.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import presensiMhsController from "../controllers/presensi-mhs-controller.js";

const mahasiswaRoute = express.Router();

mahasiswaRoute.put(
  "/api/v1/mahasiswa",
  verifyTokenMahasiswa,
  mahasiswaController.updateMahasiswa
);

// PRESENSI
mahasiswaRoute.post(
  "/api/v1/presensi-mahasiswa/:jadwalMataKuliahId",
  verifyTokenMahasiswa,
  presensiMhsController.generateQrCode
);

export { mahasiswaRoute };
