import express from "express";
import { verifyTokenAdmin } from "../middleware/auth-middleware.js";
import fakultasController from "../controllers/fakultas-controller.js";
import prodiController from "../controllers/prodi-controller.js";
import authController from "../controllers/auth-controller.js";
import dosenController from "../controllers/dosen-controller.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import mataKuliahController from "../controllers/mata-kuliah-controller.js";
import jadwalMatkulController from "../controllers/jadwal-matkul-controller.js";
import mhsMatkulController from "../controllers/mhs-matkul-controller.js";
import mhsJadwalController from "../controllers/mhs-jadwal-controller.js";

const adminRoute = express.Router();

// AUTHENTICATION
adminRoute.post(
  "/api/v1/auth/mahasiswa-register",
  verifyTokenAdmin,
  authController.registerMahasiswa
);
adminRoute.post(
  "/api/v1/auth/dosen-register",
  verifyTokenAdmin,
  authController.registerDosen
);

// FAKULTAS
adminRoute.post(
  "/api/v1/fakultas",
  verifyTokenAdmin,
  fakultasController.createFakultas
);
adminRoute.put(
  "/api/v1/fakultas",
  verifyTokenAdmin,
  fakultasController.updateFakultas
);
adminRoute.delete(
  "/api/v1/fakultas/:id",
  verifyTokenAdmin,
  fakultasController.deleteFakultas
);

// PRODI
adminRoute.post("/api/v1/prodi", verifyTokenAdmin, prodiController.createProdi);
adminRoute.put("/api/v1/prodi", verifyTokenAdmin, prodiController.updateProdi);
adminRoute.delete(
  "/api/v1/prodi/:id",
  verifyTokenAdmin,
  prodiController.deleteProdi
);

// DOSEN
adminRoute.get("/api/v1/dosen", verifyTokenAdmin, dosenController.findAllDosen);
adminRoute.put(
  "/api/v1/dosen/:dosenNip",
  verifyTokenAdmin,
  dosenController.updateDosenForAdmin
);
adminRoute.delete(
  "/api/v1/dosen/:dosenNip",
  verifyTokenAdmin,
  dosenController.deleteDosen
);

// MAHASISWA
adminRoute.get(
  "/api/v1/mahasiswa",
  verifyTokenAdmin,
  mahasiswaController.findAllMahasiswa
);
adminRoute.put(
  "/api/v1/mahasiswa/:mahasiswaNim",
  verifyTokenAdmin,
  mahasiswaController.updateMahasiswaForAdmin
);
adminRoute.delete(
  "/api/v1/mahasiswa/:mahasiswaNim",
  verifyTokenAdmin,
  mahasiswaController.deleteMahasiswa
);
// MATA KULIAH MAHASISWA
adminRoute.put(
  "/api/v1/mahasiswa/:mahasiswaNim/mata-kuliah",
  verifyTokenAdmin,
  mhsMatkulController.updateManyMataKuliahMahasiswa
);
// JADWAL MAHASISWA
adminRoute.put(
  "/api/v1/mahasiswa/:mahasiswaNim/jadwal-matkul",
  verifyTokenAdmin,
  mhsJadwalController.updateManyJadwalMahasiswa
);

// MATA KULIAH
adminRoute.post(
  "/api/v1/mata-kuliah",
  verifyTokenAdmin,
  mataKuliahController.createMataKuliah
);
adminRoute.put(
  "/api/v1/mata-kuliah",
  verifyTokenAdmin,
  mataKuliahController.updateMataKuliah
);
adminRoute.delete(
  "/api/v1/mata-kuliah/:kode",
  verifyTokenAdmin,
  mataKuliahController.deleteMataKuliah
);

// JADWAL MATA KULIAH
adminRoute.post(
  "/api/v1/jadwal-matkul",
  verifyTokenAdmin,
  jadwalMatkulController.createJadwalMataKuliah
);
adminRoute.put(
  "/api/v1/jadwal-matkul",
  verifyTokenAdmin,
  jadwalMatkulController.updateJadwalMataKuliah
);
adminRoute.delete(
  "/api/v1/jadwal-matkul/:id",
  verifyTokenAdmin,
  jadwalMatkulController.deleteJadwalMataKuliah
);

export { adminRoute };
