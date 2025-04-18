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

// TODO create new fakultas
const createFakultas = async (request) => {
  // TODO validasi request
  const createFakultasRequest = validate(createFakultasSchemaRequest, request);

  try {
    // TODO cek apakah fakultas sudah ada
    const fakultas = await prisma.fakultas.findFirst({
      where: { nama: createFakultasRequest.nama },
    });

    // TODO throw error jika fakultas sudah ada
    if (fakultas) throw new ResponseError(400, "Fakultas already exist");

    // TODO membuat fakultas baru
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

// TODO update fakultas
const updateFakultas = async (request) => {
  // TODO validasi request
  const updateFakultasRequest = validate(updateFakultasSchemaRequest, request);

  // TODO cek apakah fakultas sudah ada
  const fakultas = await prisma.fakultas.findUnique({
    where: { id: updateFakultasRequest.id },
  });

  // TODO throw error jika fakultas tidak ada
  if (!fakultas) throw new ResponseError(404, "Fakultas not found");

  // TODO update fakultas
  const fakultasUpdated = await prisma.fakultas.update({
    where: { id: updateFakultasRequest.id },
    data: {
      nama: updateFakultasRequest.nama,
      dekan: updateFakultasRequest.dekan,
      updatedAt: new Date(),
    },
  });

  return updateFakultasResponse(fakultasUpdated);
};

// TODO find fakultas by id
const findFakultasById = async (fakultasId) => {
  // TODO validasi fakultas id
  if (!fakultasId || typeof fakultasId !== "string")
    throw new ResponseError(400, "Fakultas ID is not valid");

  try {
    // TODO cek apakah fakultas sudah ada
    const fakultas = await prisma.fakultas.findUnique({
      where: { id: fakultasId },
      include: { prodi: true },
    });

    // TODO throw error jika fakultas tidak ada
    if (!fakultas) throw new ResponseError(404, "Fakultas not found");

    return findFakultasByIdResponse(fakultas);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO find fakultas by name
const findFakultasByName = async (fakultasName) => {
  // TODO validasi fakultas name
  if (!fakultasName || typeof fakultasName !== "string")
    throw new ResponseError(400, "Fakultas name is not valid");

  try {
    // TODO cek apakah fakultas sudah ada
    const fakultas = await prisma.fakultas.findFirst({
      where: { nama: fakultasName },
    });

    // TODO throw error jika fakultas tidak ada
    if (!fakultas) throw new ResponseError(404, "Fakultas not found");

    return fakultas;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO find all fakultas
const findAllFakultas = async ({ nama, dekan, page = 1, pageSize = 10 }) => {
  // TODO validasi page dan page size
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1)
    throw new ResponseError(400, "Invalid pagination parameters");

  // TODO filter fakultas by nama dan dekan
  const where = {};
  if (nama) where.nama = { contains: nama, mode: "insensitive" };
  if (dekan) where.dekan = { contains: dekan, mode: "insensitive" };

  try {
    const [fakultasList, totalItems] = await Promise.all([
      // TODO find all fakultas dengan pagination dan include prodi
      prisma.fakultas.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { prodi: true },
        orderBy: { createdAt: "desc" },
      }),

      // TODO count total fakultas
      prisma.fakultas.count({ where }),
    ]);

    // total halaman
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: fakultasList,
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
      throw new ResponseError(500, "Database error");

    throw new ResponseError(500, "Internal server error");
  }
};

// TODO delete fakultas
const deleteFakultas = async (fakultasId) => {
  // TODO validasi fakultas id
  if (!fakultasId || typeof fakultasId !== "string")
    throw new ResponseError(400, "Fakultas ID is not valid");

  try {
    // TODO cek apakah fakultas sudah ada
    const fakultas = await prisma.fakultas.findUnique({
      where: { id: fakultasId },
    });

    // TODO throw error jika fakultas tidak ada
    if (!fakultas) throw new ResponseError(404, "Fakultas not found");

    // TODO delete fakultas
    await prisma.fakultas.delete({
      where: { id: fakultasId },
    });

    return { name: fakultas.nama };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};
export default {
  createFakultas,
  updateFakultas,
  findFakultasById,
  findFakultasByName,
  findAllFakultas,
  deleteFakultas,
};
