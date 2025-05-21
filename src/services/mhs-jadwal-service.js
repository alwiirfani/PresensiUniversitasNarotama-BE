import { validate } from "../utils/validation-util.js";
import prisma from "../manager/db/prisma.js";
import { updateManyJadwalMahasiswaSchemaRequest } from "../dto/request/mahasiswa/mahasiswa-request.js";
import mahasiswaService from "./mahasiswa-service.js";

const updateManyJadwalMahasiswa = async (mahasiswaNim, request) => {
  const updateManyJadwalMahasiswaRequest = validate(
    updateManyJadwalMahasiswaSchemaRequest,
    request
  );

  // TODO cek apakah mahasiswa sudah ada
  const mahasiswaExist = await mahasiswaService.getMahasiswaByNim(mahasiswaNim);

  const listJadwal = updateManyJadwalMahasiswaRequest.jadwal;

  // TODO cek apakah ada data yang berelasi
  const existJadwal = await prisma.mahasiswaJadwal.findMany({
    where: { mahasiswaNim: mahasiswaExist.nim },
    select: { jadwalMataKuliahId: true },
  });

  const existingSet = new Set(existJadwal.map((e) => e.jadwalMataKuliahId));

  // TODO filter
  const toInsertJadwal = listJadwal
    .filter((id) => !existingSet.has(id))
    .map((id) => ({
      mahasiswaNim: mahasiswaExist.nim,
      jadwalMataKuliahId: id,
    }));

  // TODO tambah relasi baru
  if (toInsertJadwal.length > 0) {
    await prisma.mahasiswaJadwal.createMany({
      data: toInsertJadwal,
    });
  }

  return {
    jumlahJadwalBaru: toInsertJadwal.length,
  };
};

export default { updateManyJadwalMahasiswa };
