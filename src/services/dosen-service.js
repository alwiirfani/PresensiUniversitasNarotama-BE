import {
  updateDosenForAdminSchemaRequest,
  updateDosenSchemaRequest,
} from "../dto/request/dosen/dosen-request.js";
import {
  updateDosenResponse,
  findDosenByNipResponse,
} from "../dto/response/dosen/dosen-response.js";
import { validate } from "../utils/validation-util.js";
import prisma from "../manager/db/prisma.js";
import ResponseError from "../errors/response-error.js";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

// TODO update dosen for admin
const updateDosenForAdmin = async (dosenNip, request) => {
  // TODO validasi request
  const updateDosenForAdminRequest = validate(
    updateDosenForAdminSchemaRequest,
    request
  );

  // TODO cek apakah dosen sudah ada
  const dosen = await prisma.dosen.findUnique({
    where: { nip: dosenNip },
  });

  // TODO throw error jika dosen tidak ada
  if (!dosen) throw new ResponseError(404, "Dosen not found");

  // TODO cek apakah prodi ada
  const prodiExist = await prisma.prodi.findFirst({
    where: { nama: updateDosenForAdminRequest.namaProdi },
  });

  // TODO throw error jika prodi tidak ada
  if (!prodiExist) throw new ResponseError(404, "Prodi not found");

  // TODO update dosen
  const updatedDosen = await prisma.dosen.update({
    where: { nip: dosen.nip },
    data: {
      nama: updateDosenForAdminRequest.nama,
      email: updateDosenForAdminRequest.email,
      alamat: updateDosenForAdminRequest.alamat,
      prodiId: prodiExist.id,
      updatedAt: new Date(),
    },
    include: { prodi: true },
  });

  return updateDosenResponse(updatedDosen);
};

const updateDosen = async (request) => {
  // TODO validasi request
  const updateDosenRequest = validate(updateDosenSchemaRequest, request);

  // TODO cek apakah dosen sudah ada
  const dosen = await prisma.dosen.findUnique({
    where: { nip: updateDosenRequest.nip },
  });

  // TODO throw error jika dosen tidak ada
  if (!dosen) throw new ResponseError(404, "Dosen not found");

  // TODO cek apakah prodi ada
  const prodiExist = await prisma.prodi.findFirst({
    where: { nama: updateDosenRequest.namaProdi },
  });

  // TODO throw error jika prodi tidak ada
  if (!prodiExist) throw new ResponseError(404, "Prodi not found");

  // TODO cek apakah password dan confirm password sama
  if (updateDosenRequest.password !== updateDosenRequest.confirmPassword)
    throw new ResponseError(400, "Password and confirm password must be same");

  // TODO hash password
  const hashedPassword = await bcrypt.hash(updateDosenRequest.password, 10);

  // TODO update dosen
  const updatedDosen = await prisma.dosen.update({
    where: { nip: updateDosenRequest.nip },
    data: {
      nama: updateDosenRequest.nama,
      password: hashedPassword,
      email: updateDosenRequest.email,
      alamat: updateDosenRequest.alamat,
      prodiId: prodiExist.id,
      updatedAt: new Date(),
    },
    include: { prodi: true },
  });

  return updateDosenResponse(updatedDosen);
};

const findDosenByNip = async (dosenNip) => {
  // TODO cek dosenNip ada dan tipe data string
  if (!dosenNip || typeof dosenNip !== "string")
    throw new ResponseError(400, "Dosen NIP is not valid");

  try {
    // TODO cek apakah dosen sudah ada
    const dosen = await prisma.dosen.findUnique({
      where: { nip: dosenNip },
      select: {
        nip: true,
        nama: true,
        email: true,
        alamat: true,
        createdAt: true,
        updatedAt: true,
        prodi: { select: { nama: true } },
        dosenMatakuliah: {
          select: {
            mataKuliah: {
              select: {
                kode: true,
                nama: true,
                jadwalMataKuliah: {
                  select: {
                    id: true,
                    hari: true,
                    jamMulai: true,
                    jamSelesai: true,
                    ruangan: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // TODO throw error jika dosen tidak ada
    if (!dosen) throw new ResponseError(404, "Dosen not found");

    return findDosenByNipResponse(dosen);
    // return dosen;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const getDosenByNip = async (dosenNip) => {
  // TODO cek dosenNip ada dan tipe data string
  if (!dosenNip || typeof dosenNip !== "string")
    throw new ResponseError(400, "Dosen NIP is not valid");

  try {
    // TODO cek apakah dosen sudah ada
    const dosen = await prisma.dosen.findUnique({
      where: { nip: dosenNip },
    });

    // TODO throw error jika dosen tidak ada
    if (!dosen) throw new ResponseError(404, "Dosen not found");

    return dosen;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findAllDosen = async ({ namaProdi, page = 1, pageSize = 10 }) => {
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1)
    throw new ResponseError(400, "Invalid pagination parameters");

  const where = {};
  if (namaProdi)
    where.prodi = { nama: { contains: namaProdi, mode: "insensitive" } };

  try {
    const [dosenList, totalItems] = await Promise.all([
      prisma.dosen.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { prodi: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.dosen.count({ where }),
    ]);

    // total halaman
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: dosenList,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new ResponseError(500, error.message);
    }
    throw new ResponseError(error.status, error.message);
  }
};

const deleteDosen = async (dosenNip) => {
  // TODO cek dosenNip ada dan tipe data string
  if (!dosenNip || typeof dosenNip !== "string")
    throw new ResponseError(400, "Dosen NIP is not valid");

  try {
    // TODO cek apakah dosen sudah ada
    const dosen = await prisma.dosen.findUnique({
      where: { nip: dosenNip },
    });

    // TODO throw error jika dosen tidak ada
    if (!dosen) throw new ResponseError(404, "Dosen not found");

    // TODO delete dosen
    await prisma.dosen.delete({ where: { nip: dosenNip } });

    return { nama: dosen.nama };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default {
  updateDosenForAdmin,
  updateDosen,
  findDosenByNip,
  getDosenByNip,
  findAllDosen,
  deleteDosen,
};
