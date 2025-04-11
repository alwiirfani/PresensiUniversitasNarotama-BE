import {
  createFakultasSchemaRequest,
  updateFakultasSchemaRequest,
} from "../dto/request/fakultas/fakultas-request.js";
import {
  createFakultasResponse,
  findFakultasByIdResponse,
  updateFakultasResponse,
} from "../dto/response/fakultas/fakultas-response.js";
import prisma from "../configs/db/prisma.js";
import { validate } from "../utils/validation-util.js";
import ResponseError from "../errors/response-error.js";
import { v4 as uuid } from "uuid";
import { Prisma } from "@prisma/client";

// create new fakultas
const createFakultas = async (request) => {
  // validasi request
  const createFakultasRequest = validate(createFakultasSchemaRequest, request);

  try {
    // cek apakah fakultas sudah ada
    const fakultas = await prisma.fakultas.findFirst({
      where: {
        nama: createFakultasRequest.nama,
      },
    });

    // throw error jika fakultas sudah ada
    if (fakultas) throw new ResponseError(400, "Fakultas already exist");

    // membuat fakultas baru
    const createFakultas = await prisma.fakultas.create({
      data: {
        id: uuid().toString(),
        nama: createFakultasRequest.nama,
        dekan: createFakultasRequest.dekan,
      },
    });

    return createFakultasResponse(createFakultas);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// update fakultas
const updateFakultas = async (request) => {
  // validasi request
  const updateFakultasRequest = validate(updateFakultasSchemaRequest, request);

  // cek apakah fakultas sudah ada
  const fakultas = await prisma.fakultas.findUnique({
    where: {
      id: updateFakultasRequest.id,
    },
  });

  // throw error jika fakultas tidak ada
  if (!fakultas) throw new ResponseError(404, "Fakultas not found");

  // update fakultas
  const fakultasUpdated = await prisma.fakultas.update({
    where: {
      id: updateFakultasRequest.id,
    },
    data: {
      nama: updateFakultasRequest.nama,
      dekan: updateFakultasRequest.dekan,
      updatedAt: new Date(),
    },
  });

  return updateFakultasResponse(fakultasUpdated);
};

// find fakultas by id
const findFakultasById = async (fakultasId) => {
  // validasi fakultas id
  if (!fakultasId || typeof fakultasId !== "string")
    throw new ResponseError(400, "Fakultas ID is not valid");

  try {
    // cek apakah fakultas sudah ada
    const fakultas = await prisma.fakultas.findUnique({
      where: {
        id: fakultasId,
      },
      include: {
        prodi: true,
      },
    });

    // throw error jika fakultas tidak ada
    if (!fakultas) throw new ResponseError(404, "Fakultas not found");

    return findFakultasByIdResponse(fakultas);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// find all fakultas
const findAllFakultas = async ({ nama, dekan, page = 1, pageSize = 10 }) => {
  // validasi page dan page size
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1)
    throw new ResponseError(400, "Invalid pagination parameters");

  // filter fakultas by nama dan dekan
  const where = {};
  if (nama) where.nama = { contains: nama, mode: "insensitive" };
  if (dekan) where.dekan = { contains: dekan, mode: "insensitive" };

  try {
    const [fakultasList, totalItems] = await Promise.all([
      // find all fakultas dengan pagination dan include prodi
      prisma.fakultas.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { prodi: true },
        orderBy: { createdAt: "desc" },
      }),

      // count total fakultas
      prisma.fakultas.count({ where }),
    ]);

    // total halaman
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: fakultasList,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    // handle error prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      throw new ResponseError(500, "Database error");

    throw new ResponseError(500, "Internal server error");
  }
};

// delete fakultas
const deleteFakultas = async (fakultasId) => {
  // validasi fakultas id
  if (!fakultasId || typeof fakultasId !== "string")
    throw new ResponseError(400, "Fakultas ID is not valid");

  try {
    // cek apakah fakultas sudah ada
    const fakultas = await prisma.fakultas.findUnique({
      where: {
        id: fakultasId,
      },
    });

    // throw error jika fakultas tidak ada
    if (!fakultas) throw new ResponseError(404, "Fakultas not found");

    // delete fakultas
    await prisma.fakultas.delete({
      where: {
        id: fakultasId,
      },
    });

    return {
      name: fakultas.nama,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};
export default {
  createFakultas,
  updateFakultas,
  findFakultasById,
  findAllFakultas,
  deleteFakultas,
};
