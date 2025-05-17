import {
  createJadwalMataKuliahSchemaRequest,
  updateJadwalMataKuliahSchemaRequest,
} from "../dto/request/jadwalMatKul/jadwal-matkul-request.js";
import {
  createJadwalMataKuliahResponse,
  findJadwalMataKuliahByIdResponse,
  updateJadwalMataKuliahResponse,
} from "../dto/response/jadwalMatKul/jadwal-matkul-response.js";
import { validate } from "../utils/validation-util.js";
import prisma from "../manager/db/prisma.js";
import dosenService from "./dosen-service.js";
import mataKuliahService from "./mata-kuliah-service.js";
import ResponseError from "../errors/response-error.js";
import { Prisma } from "@prisma/client";

const createJadwalMataKuliah = async (request) => {
  // TODO validasi request
  const createJadwalMataKuliahRequest = validate(
    createJadwalMataKuliahSchemaRequest,
    request
  );

  try {
    // TODO cek apakah mata kuliah sudah ada
    const mataKuliahExist =
      await mataKuliahService.findMataKuliahByNamaMataKuliah(
        createJadwalMataKuliahRequest.namaMataKuliah
      );

    // TODO cek apakah dosen sudah ada
    const dosenExist = await dosenService.getDosenByNip(
      createJadwalMataKuliahRequest.dosenNip
    );

    // TODO cek apakah jadwal sudah ada
    const jadwalExist = await prisma.jadwalMataKuliah.findFirst({
      where: {
        mataKuliahKode: mataKuliahExist.kode,
        dosenNip: dosenExist.nip,
      },
    });

    // TODO throw error jika jadwal sudah ada
    if (jadwalExist) throw new ResponseError(400, "Jadwal already exist");

    // TODO membuat jadwal baru
    const createJadwalMataKuliah = await prisma.jadwalMataKuliah.create({
      data: {
        mataKuliahKode: mataKuliahExist.kode,
        dosenNip: dosenExist.nip,
        hari: createJadwalMataKuliahRequest.hari,
        jamMulai: createJadwalMataKuliahRequest.jamMulai,
        jamSelesai: createJadwalMataKuliahRequest.jamSelesai,
        ruangan: createJadwalMataKuliahRequest.ruangan,
        createdAt: new Date(),
      },
      include: {
        mataKuliah: true,
        dosen: true,
      },
    });

    return createJadwalMataKuliahResponse(createJadwalMataKuliah);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const updateJadwalMataKuliah = async (request) => {
  // TODO validasi request
  const updateJadwalMataKuliahRequest = validate(
    updateJadwalMataKuliahSchemaRequest,
    request
  );

  // TODO cek apakah jadwal sudah ada
  const jadwalExist = await prisma.jadwalMataKuliah.findUnique({
    where: { id: updateJadwalMataKuliahRequest.id },
  });

  // TODO throw error jika jadwal tidak ada
  if (!jadwalExist) throw new ResponseError(404, "Jadwal Not Found");

  // TODO cek apakah mata kuliah sudah ada
  const mataKuliahExist =
    await mataKuliahService.findMataKuliahByNamaMataKuliah(
      updateJadwalMataKuliahRequest.namaMataKuliah
    );

  // TODO cek apakah dosen sudah ada
  const dosenExist = await dosenService.getDosenByNip(
    updateJadwalMataKuliahRequest.dosenNip
  );

  // TODO update jadwal
  const updatedJadwalMataKuliah = await prisma.jadwalMataKuliah.update({
    where: { id: updateJadwalMataKuliahRequest.id },
    data: {
      mataKuliahKode: mataKuliahExist.kode,
      dosenNip: dosenExist.nip,
      hari: updateJadwalMataKuliahRequest.hari,
      jamMulai: updateJadwalMataKuliahRequest.jamMulai,
      jamSelesai: updateJadwalMataKuliahRequest.jamSelesai,
      ruang: updateJadwalMataKuliahRequest.ruang,
      updatedAt: new Date(),
    },
    include: {
      mataKuliah: true,
      dosen: true,
    },
  });

  return updateJadwalMataKuliahResponse(updatedJadwalMataKuliah);
};

const findJadwalMataKuliahById = async (id) => {
  // TODO validasi id
  if (!id || typeof id !== "string")
    throw new ResponseError(400, "ID is not valid");

  try {
    // TODO cek apakah jadwal sudah ada
    const jadwal = await prisma.jadwalMataKuliah.findUnique({
      where: { id },
      include: {
        mataKuliah: true,
        dosen: true,
      },
    });

    // TODO throw error jika jadwal tidak ada
    if (!jadwal) throw new ResponseError(404, "Jadwal Not Found");

    return findJadwalMataKuliahByIdResponse(jadwal);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findAllJadwalMataKuliah = async ({ hari, page = 1, pageSize = 10 }) => {
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1)
    throw new ResponseError(400, "Invalid pagination parameters");

  const where = {};
  if (hari) where.hari = { contains: hari, mode: "insensitive" };

  try {
    const [listJadwal, totalItems] = await Promise.all([
      prisma.jadwalMataKuliah.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { mataKuliah: true, dosen: true },
        orderBy: { createdAt: "desc" },
      }),

      // TODO count total mata kuliah
      prisma.jadwalMataKuliah.count({ where }),
    ]);

    // total halaman
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: listJadwal,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      throw new ResponseError(500, "Database Error");

    throw new ResponseError(500, "Internal Server Error");
  }
};

const deleteJadwalMataKuliahById = async (id) => {
  // TODO validasi id
  if (!id || typeof id !== "string")
    throw new ResponseError(400, "ID is not valid");

  try {
    // TODO cek apakah jadwal sudah ada
    const jadwal = await prisma.jadwalMataKuliah.findUnique({
      where: { id },
    });

    // TODO throw error jika jadwal tidak ada
    if (!jadwal) throw new ResponseError(404, "Jadwal Not Found");

    // TODO delete jadwal
    await prisma.jadwalMataKuliah.delete({ where: { id } });

    return { id };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default {
  createJadwalMataKuliah,
  updateJadwalMataKuliah,
  findJadwalMataKuliahById,
  findAllJadwalMataKuliah,
  deleteJadwalMataKuliahById,
};
