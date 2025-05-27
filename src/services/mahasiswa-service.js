import {
  updateMahasiswaForAdminSchemaRequest,
  updateMahasiswaSchemaRequest,
} from "../dto/request/mahasiswa/mahasiswa-request.js";
import {
  findMahasiswaByNimResponse,
  updateMahasiswaResponse,
} from "../dto/response/mahasiswa/mahasiswa-response.js";
import { validate } from "../utils/validation-util.js";
import prisma from "../manager/db/prisma.js";
import ResponseError from "../errors/response-error.js";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

// TODO update mahasiswa for admin
const updateMahasiswaForAdmin = async (mahasiswaNim, request) => {
  const updateMahasiswaForAdminRequest = validate(
    updateMahasiswaForAdminSchemaRequest,
    request
  );

  // TODO cek apakah mahasiswa sudah ada
  const mahasiswa = await prisma.mahasiswa.findUnique({
    where: { nim: mahasiswaNim },
  });

  // TODO throw error jika tidak ada
  if (!mahasiswa) throw new ResponseError(404, "Mahasiswa Not Found");

  // TODO cek apakah prodi ada
  const prodiExist = await prisma.prodi.findFirst({
    where: { nama: updateMahasiswaForAdminRequest.namaProdi },
  });

  // TODO throw error jika prodi tidak ada
  if (!prodiExist) throw new ResponseError(404, "Prodi Not Found");

  // TODO update mahasiswa
  const mahasiswaUpdated = await prisma.mahasiswa.update({
    where: { nim: mahasiswa.nim },
    data: {
      nama: updateMahasiswaForAdminRequest.nama,
      email: updateMahasiswaForAdminRequest.email,
      alamat: updateMahasiswaForAdminRequest.alamat,
      prodiId: prodiExist.id,
      updatedAt: new Date(),
    },
    include: { prodi: true },
  });

  return updateMahasiswaResponse(mahasiswaUpdated);
};

// TODO update mahasiswa
const updateMahasiswa = async (request) => {
  const updateMahasiswaRequest = validate(
    updateMahasiswaSchemaRequest,
    request
  );

  // TODO cek apakah mahasiswa sudah ada
  const mahasiswa = await prisma.mahasiswa.findUnique({
    where: { nim: updateMahasiswaRequest.nim },
  });

  // TODO throw error jika tidak ada
  if (!mahasiswa) throw new ResponseError(404, "Mahasiswa Not Found");

  // TODO cek apakah prodi ada
  const prodiExist = await prisma.prodi.findFirst({
    where: { nama: updateMahasiswaRequest.namaProdi },
  });

  // TODO throw error jika prodi tidak ada
  if (!prodiExist) throw new ResponseError(404, "Prodi Not Found");

  // TODO cek apakah password dan confirm password sama
  if (
    updateMahasiswaRequest.password !== updateMahasiswaRequest.confirmPassword
  )
    throw new ResponseError(400, "Password and confirm password must be same");

  // TODO hash password
  const hashPassword = await bcrypt.hash(updateMahasiswaRequest.password, 10);

  // TODO update mahasiswa
  const mahasiswaUpdated = await prisma.mahasiswa.update({
    where: { nim: updateMahasiswaRequest.nim },
    data: {
      nama: updateMahasiswaRequest.nama,
      password: hashPassword,
      email: updateMahasiswaRequest.email,
      alamat: updateMahasiswaRequest.alamat,
      prodiId: prodiExist.id,
      updatedAt: new Date(),
    },
    include: { prodi: true },
  });

  return updateMahasiswaResponse(mahasiswaUpdated);
};

const findMahasiswaByNim = async (mahasiswaNim) => {
  // TODO cek mahasiswaNim ada dan tipe data string
  if (!mahasiswaNim || typeof mahasiswaNim !== "string")
    throw new ResponseError(400, "Mahasiswa NIM is not valid");

  try {
    // TODO cek apakah mahasiswa sudah ada
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim: mahasiswaNim },
      select: {
        nim: true,
        nama: true,
        email: true,
        alamat: true,
        createdAt: true,
        updatedAt: true,
        prodi: { select: { nama: true } },
        mahasiswaJadwal: {
          select: {
            jadwalMataKuliahId: true,
            jadwalMataKuliah: {
              select: {
                hari: true,
                jamMulai: true,
                jamSelesai: true,
                ruangan: true,
                dosen: { select: { nama: true } },
                mataKuliah: { select: { nama: true } },
              },
            },
          },
        },
      },
    });

    // TODO throw error jika mahasiswa tidak ada
    if (!mahasiswa) throw new ResponseError(404, "Mahasiswa not found");

    return findMahasiswaByNimResponse(mahasiswa);
    // return mahasiswa;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findAllMahasiswa = async ({ namaProdi, page = 1, pageSize = 10 }) => {
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1)
    throw new ResponseError(400, "Invalid pagination parameters");

  const where = {};
  if (namaProdi)
    where.prodi = { nama: { contains: namaProdi, mode: "insensitive" } };

  try {
    const [mahasiswaList, totalItems] = await Promise.all([
      prisma.mahasiswa.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { prodi: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.mahasiswa.count({ where }),
    ]);

    // total halaman
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: mahasiswaList,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      throw new ResponseError(500, error.message);

    throw new ResponseError(error.status, error.message);
  }
};

const deleteMahasiswa = async (mahasiswaNim) => {
  // TODO cek mahasiswaNim ada dan tipe data string
  if (!mahasiswaNim || typeof mahasiswaNim !== "string")
    throw new ResponseError(400, "Mahasiswa NIM is not valid");

  try {
    // TODO cek apakah mahasiswa sudah ada
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim: mahasiswaNim },
    });

    // TODO throw error jika mahasiswa tidak ada
    if (!mahasiswa) throw new ResponseError(404, "Mahasiswa not found");

    // TODO delete mahasiswa
    await prisma.mahasiswa.delete({ where: { nim: mahasiswaNim } });

    return { nama: mahasiswa.nama };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const getMahasiswaByNim = async (mahasiswaNim) => {
  // TODO cek mahasiswaNim ada dan tipe data string
  if (!mahasiswaNim || typeof mahasiswaNim !== "string")
    throw new ResponseError(400, "Mahasiswa NIM is not valid");

  try {
    // TODO cek apakah mahasiswa sudah ada
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim: mahasiswaNim },
    });

    // TODO throw error jika mahasiswa tidak ada
    if (!mahasiswa) throw new ResponseError(404, "Mahasiswa not found");

    return mahasiswa;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default {
  updateMahasiswaForAdmin,
  updateMahasiswa,
  findMahasiswaByNim,
  findAllMahasiswa,
  deleteMahasiswa,
  getMahasiswaByNim,
};
