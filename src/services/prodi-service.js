import {
  createProdiSchemaRequest,
  updateProdiSchemaRequest,
} from "../dto/request/prodi/prodi-request.js";
import prisma from "../configs/db/prisma.js";
import { validate } from "../utils/validation-util.js";
import fakultasService from "./fakultas-service.js";
import {
  createProdiResponse,
  findProdiByIdResponse,
  updateProdiResponse,
} from "../dto/response/prodi/prodi-response.js";
import ResponseError from "../errors/response-error.js";
import { v4 as uuid } from "uuid";
import { Prisma } from "@prisma/client";

const createProdi = async (request) => {
  // TODO validasi request
  const createProdiRequest = validate(createProdiSchemaRequest, request);

  try {
    // TODO cek fakultas apakah ada
    const fakultas = await fakultasService.findFakultasByName(
      createProdiRequest.namaFakultas
    );

    // TODO cek prodi apakah ada
    const prodiExist = await prisma.prodi.findFirst({
      where: {
        nama: createProdiRequest.nama,
        fakultasId: fakultas.id,
      },
    });

    // TODO throw error jika prodi sudah ada
    if (prodiExist) throw new ResponseError(400, "Prodi already exist");

    // TODO membuat prodi baru
    const createProdi = await prisma.prodi.create({
      data: {
        id: uuid().toString(),
        nama: createProdiRequest.nama,
        kode: createProdiRequest.kode,
        fakultasId: fakultas.id,
        createdAt: new Date(),
      },
      include: {
        fakultas: true,
      },
    });

    return createProdiResponse(createProdi);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const updateProdi = async (request) => {
  // TODO validasi request
  const updateProdiRequest = validate(updateProdiSchemaRequest, request);

  // TODO cek apakah prodi sudah ada
  const prodi = await prisma.prodi.findUnique({
    where: {
      id: updateProdiRequest.id,
    },
  });

  // TODO throw error jika tidak ada
  if (!prodi) throw new ResponseError(404, "Prodi Not Found");

  // TODO cek apakah fakultas ada
  const fakultasExist = await prisma.fakultas.findFirst({
    where: {
      nama: updateProdiRequest.namaFakultas,
    },
  });

  // TODO throw error jika fakultas tidak ada
  if (!fakultasExist) throw new ResponseError(404, "Fakultas Not Found");

  // TODO update prodi
  const prodiUpdated = await prisma.prodi.update({
    where: {
      id: updateProdiRequest.id,
    },
    data: {
      nama: updateProdiRequest.nama,
      kode: updateProdiRequest.kode,
      fakultasId: fakultasExist.id,
      updatedAt: new Date(),
    },
    include: {
      fakultas: true,
    },
  });

  return updateProdiResponse(prodiUpdated);
};

const findProdiById = async (prodiId) => {
  // TODO validasi prodi id
  if (!prodiId || typeof prodiId !== "string")
    throw new ResponseError(400, "Prodi ID is not valid");

  try {
    // TODO cek apakah prodi sudah ada
    const prodi = await prisma.prodi.findUnique({
      where: {
        id: prodiId,
      },
      include: {
        fakultas: true,
      },
    });

    // TODO throw error jika prodi tidak ada
    if (!prodi) throw new ResponseError(404, "Prodi not found");

    return findProdiByIdResponse(prodi);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findProdiByName = async (prodiName) => {
  // TODO validasi prodi name
  if (!prodiName || typeof prodiName !== "string")
    throw new ResponseError(400, "Prodi name is not valid");

  try {
    // TODO cek apakah prodi sudah ada
    const prodi = await prisma.prodi.findFirst({
      where: {
        nama: prodiName,
      },
      include: {
        fakultas: true,
      },
    });

    // TODO throw error jika prodi tidak ada
    if (!prodi) throw new ResponseError(404, "Prodi not found");

    return prodi;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findAllProdi = async ({ nama, kode, page = 1, pageSize = 10 }) => {
  // TODO validasi page dan page size
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1)
    throw new ResponseError(400, "Invalid pagination parameters");

  // TODO filter prodi by nama dan kode
  const where = {};
  if (nama) where.nama = { contains: nama, mode: "insensitive" };
  if (kode) where.kode = { contains: kode, mode: "insensitive" };

  try {
    const [prodiList, totalItems] = await Promise.all([
      // TODO find all prodi dengan pagination dan include fakultas
      prisma.prodi.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { fakultas: true },
        orderBy: { createdAt: "desc" },
      }),

      // TODO count total prodi
      prisma.prodi.count({ where }),
    ]);

    // total halaman
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: prodiList,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    // TODO throw error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new ResponseError(500, error.message);
    }
  }
};

const deleteProdi = async (prodiId) => {
  // TODO validasi prodi id
  if (!prodiId || typeof prodiId !== "string")
    throw new ResponseError(400, "Prodi ID is not valid");

  try {
    // TODO cek apakah prodi sudah ada
    const prodi = await prisma.prodi.findUnique({
      where: {
        id: prodiId,
      },
    });

    // TODO throw error jika prodi tidak ada
    if (!prodi) throw new ResponseError(404, "Prodi not found");

    // TODO delete prodi
    await prisma.prodi.delete({
      where: {
        id: prodiId,
      },
    });

    return {
      name: prodi.nama,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default {
  createProdi,
  updateProdi,
  findProdiById,
  findProdiByName,
  findAllProdi,
};
