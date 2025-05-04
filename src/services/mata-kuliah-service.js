import { createNewMataKuliahSchemaRequest } from "../dto/request/mataKuliah/mata-kuliah-request.js";
import prisma from "../manager/db/prisma.js";
import ResponseError from "../errors/response-error.js";
import { validate } from "../utils/validation-util.js";
import prodiService from "./prodi-service.js";
import { createNewMataKuliahResponse } from "../dto/response/mataKuliah/mata-kulaih-response.js";

const createMataKuliah = async (request) => {
  // TODO validasi request
  const createNewMataKuliahRequest = validate(
    createNewMataKuliahSchemaRequest,
    request
  );

  try {
    // TODO cek prodi apakah ada
    const prodiExist = await prodiService.findProdiByName(
      createNewMataKuliahRequest.namaProdi
    );

    // TODO cek apakah mata kuliah sudah ada
    const mataKuliahExist = await prisma.mataKuliah.findUnique({
      where: { kode: createNewMataKuliahRequest.kode, prodiId: prodiExist.id },
    });

    // TODO throw error jika mata kuliah sudah ada
    if (mataKuliahExist)
      throw new ResponseError(400, "Mata Kuliah already exist");

    // TODO membuat mata kuliah baru
    const createMataKuliah = await prisma.mataKuliah.create({
      data: {
        kode: createNewMataKuliahRequest.kode,
        nama: createNewMataKuliahRequest.nama,
        sks: createNewMataKuliahRequest.sks,
        prodiId: prodiExist.id,
        createdAt: new Date(),
      },
      include: { prodi: true },
    });

    return createNewMataKuliahResponse(createMataKuliah);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const updateMatakuliah = (request) => {};

const findMataKuliahByKode = (mataKuliahKode) => {};

const findAllMataKuliah = ({ namaProdi, page = 1, pageSize = 10 }) => {};

const deleteMataKuliah = (mataKuliahKode) => {};
export default {
  createMataKuliah,
  updateMatakuliah,
  findMataKuliahByKode,
  findAllMataKuliah,
  deleteMataKuliah,
};
