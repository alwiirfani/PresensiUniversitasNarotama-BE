import express from "express";
import fakultasController from "../controllers/fakultas-controller.js";
import authController from "../controllers/auth-controller.js";
import prodiController from "../controllers/prodi-controller.js";
import presensiDosenController from "../controllers/presensi-dosen-controller.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import mataKuliahController from "../controllers/mata-kuliah-controller.js";

const publicRoute = express.Router();

// PING
publicRoute.get("/", (req, res) => {
  res.send("PING!!");
});

// AUTHENTICATION
publicRoute.post("/api/v1/auth/admin-register", authController.registerAdmin);
publicRoute.post("/api/v1/auth/admin-login", authController.loginAdmin);
publicRoute.post("/api/v1/auth/dosen-login", authController.loginDosen);
publicRoute.post("/api/v1/auth/mahasiswa-login", authController.loginMahasiswa);
publicRoute.get("/api/v1/auth/refresh-token", authController.refreshToken);

// FAKULTAS
publicRoute.get("/api/v1/fakultas/:id", fakultasController.findFakultasById);
publicRoute.get("/api/v1/fakultas", fakultasController.findAllFakultas);

// PRODI
publicRoute.get("/api/v1/prodi/:id", prodiController.findProdiById);
publicRoute.get("/api/v1/prodi", prodiController.findAllProdi);

// DOSEN
publicRoute.get("/api/v1/dosen/:dosenNip");

// MAHASISWA
publicRoute.get(
  "/api/v1/mahasiswa/:mahasiswaNim",
  mahasiswaController.findMahasiswaByNim
);

// MATA KULIAH
publicRoute.get("/api/v1/mata-kuliah", mataKuliahController.findAllMataKuliah);
publicRoute.get(
  "/api/v1/mata-kuliah/:kode",
  mataKuliahController.findMataKuliahByKode
);

// PRESENSI DOSEN
publicRoute.get(
  "/api/v1/presensi-dosen",
  presensiDosenController.findAllPresensiDosen
);

export { publicRoute };
