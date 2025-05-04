import { updateManyMataKuliahMahasiswaSchemaRequest } from "../dto/request/mahasiswa/mahasiswa-request.js";
import { validate } from "../utils/validation-util.js";
import prisma from "../manager/db/prisma.js";

const updateManyMataKuliahMahasiswa = async (mahasiswaNim, request) => {
  // TODO validasi request
  const updateManyMataKuliahMahasiswaRequest = validate(
    updateManyMataKuliahMahasiswaSchemaRequest,
    request
  );

  const listNewMataKuliah = updateManyMataKuliahMahasiswaRequest.mataKuliah;
  const semester = updateManyMataKuliahMahasiswaRequest.semester ?? null;

  // TODO cek apakah ada data yang berelasi
  const existMataKuliah = await prisma.mahasiswaMataKuliah.findMany({
    where: { mahasiswaNim },
    select: { mataKuliahKode: true },
  });

  const existingSet = new Set(existMataKuliah.map((e) => e.mataKuliahKode));

  // TODO filter hanya yang belum terdaftar
  const toInsertMataKuliah = listNewMataKuliah
    .filter((kode) => !existingSet.has(kode))
    .map((kode) => ({
      mahasiswaNim,
      mataKuliahKode: kode,
      semester,
    }));

  // TODO tambah relasi baru jika ada
  if (toInsertMataKuliah.length > 0)
    await prisma.mahasiswaMataKuliah.createMany({
      data: toInsertMataKuliah,
    });

  return {
    jumlahMataKuliahBaru: toInsertMataKuliah.length,
  };
};

const deleteManyMataKuliahMahasiswa = async (mahasiswaNim, request) => {};

export default updateManyMataKuliahMahasiswa;
