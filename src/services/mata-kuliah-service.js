import {
  createNewMataKuliahSchemaRequest,
  updateMataKuliahSchemaRequest,
} from "../dto/request/mataKuliah/mata-kuliah-request.js";
import prisma from "../manager/db/prisma.js";
import ResponseError from "../errors/response-error.js";
import { validate } from "../utils/validation-util.js";
import prodiService from "./prodi-service.js";
import {
  createNewMataKuliahResponse,
  findMataKuliahByKodeResponse,
  updateMataKuliahResponse,
} from "../dto/response/mataKuliah/mata-kulaih-response.js";
import { Prisma } from "@prisma/client";

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

const updateMataKuliah = async (request) => {
  // TODO validasi request
  const updateMataKuliahRequest = validate(
    updateMataKuliahSchemaRequest,
    request
  );

  // TODO cek apakah mata kuliah sudah ada
  const mataKuliahExist = await prisma.mataKuliah.findUnique({
    where: { kode: updateMataKuliahRequest.kode },
  });

  // TODO throw error jika mata kuliah tidak ada
  if (!mataKuliahExist) throw new ResponseError(404, "Mata Kuliah Not Found");

  // TODO cek apakah prodi ada
  const prodiExist = await prodiService.findProdiByName(
    updateMataKuliahRequest.namaProdi
  );

  // TODO update mata kuliah
  const updatedMataKuliah = await prisma.mataKuliah.update({
    where: { kode: updateMataKuliahRequest.kode },
    data: {
      nama: updateMataKuliahRequest.nama,
      sks: updateMataKuliahRequest.sks,
      prodiId: prodiExist.id,
      updatedAt: new Date(),
    },
    include: { prodi: true },
  });

  return updateMataKuliahResponse(updatedMataKuliah);
};

const findMataKuliahByKode = async (kode) => {
  // TODO validasi mata kuliah kode
  if (!kode || typeof kode !== "string")
    throw new ResponseError(400, "Invalid Mata Kuliah Kode");

  try {
    // TODO cek apakah mata kuliah ada
    const mataKuliah = await prisma.mataKuliah.findUnique({
      where: { kode: kode },
      include: { prodi: true },
    });

    if (!mataKuliah) throw new ResponseError(404, "Mata Kuliah Not Found");

    return findMataKuliahByKodeResponse(mataKuliah);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findMataKuliahByNamaMataKuliah = async (namaMataKuliah) => {
  // TODO validasi nama mata kuliah
  if (!namaMataKuliah || typeof namaMataKuliah !== "string")
    throw new ResponseError(400, "Invalid Mata Kuliah Name");

  try {
    // TODO cek apakah mata kuliah ada
    const mataKuliah = await prisma.mataKuliah.findFirst({
      where: { nama: namaMataKuliah },
    });

    if (!mataKuliah) throw new ResponseError(404, "Mata Kuliah Not Found");

    return mataKuliah;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findAllMataKuliah = async ({ namaProdi, page = 1, pageSize = 10 }) => {
  // TODO validasi page dan page size
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1)
    throw new ResponseError(400, "Invalid pagination parameters");

  // TODO filter prodi by nama
  const where = {};
  if (namaProdi) where.prodi = { contains: namaProdi, mode: "insensitive" };

  try {
    const [mataKuliahList, totalItems] = await Promise.all([
      prisma.mataKuliah.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { prodi: true },
        orderBy: { createdAt: "desc" },
      }),

      // TODO count total prodi
      prisma.mataKuliah.count({ where }),
    ]);

    // total halaman
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: mataKuliahList,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    // TODO handle error prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      throw new ResponseError(500, "Database Error");

    throw new ResponseError(500, "Internal Server Error");
  }
};

const deleteMataKuliah = async (mataKuliahKode) => {
  // TODO validasi mata kuliah kode
  if (!mataKuliahKode || typeof mataKuliahKode !== "string")
    throw new ResponseError(400, "Invalid Mata Kuliah Kode");

  try {
    // TODO cek apakah mata kuliah ada
    const mataKuliah = await prisma.mataKuliah.findUnique({
      where: { kode: mataKuliahKode },
    });

    if (!mataKuliah) throw new ResponseError(404, "Mata Kuliah Not Found");

    // TODO delete mata kuliah
    await prisma.mataKuliah.delete({ where: { kode: mataKuliahKode } });

    return { nama: mataKuliah.nama };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default {
  createMataKuliah,
  updateMataKuliah,
  findMataKuliahByKode,
  findMataKuliahByNamaMataKuliah,
  findAllMataKuliah,
  deleteMataKuliah,
};
