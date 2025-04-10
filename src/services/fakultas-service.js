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

// create new fakultas
const createFakultas = async (request) => {
  const createFakultasRequest = validate(createFakultasSchemaRequest, request);

  try {
    const fakultas = await prisma.fakultas.findFirst({
      where: {
        nama: createFakultasRequest.name,
      },
    });

    if (fakultas) throw new ResponseError(400, "Fakultas already exist");

    const createFakultas = await prisma.fakultas.create({
      data: {
        id: uuid().toString(),
        nama: createFakultasRequest.name,
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
  const updateFakultasRequest = validate(updateFakultasSchemaRequest, request);

  const fakultas = await prisma.fakultas.findUnique({
    where: {
      id: updateFakultasRequest.id,
    },
  });

  if (!fakultas) throw new ResponseError(404, "Fakultas not found");

  const fakultasUpdated = await prisma.fakultas.update({
    where: {
      id: updateFakultasRequest.id,
    },
    data: {
      nama: updateFakultasRequest.name,
      dekan: updateFakultasRequest.dekan,
      updatedAt: new Date(),
    },
  });

  return updateFakultasResponse(fakultasUpdated);
};

// find fakultas by id
const findFakultasById = async (fakultasId) => {
  if (!fakultasId || typeof fakultasId !== "string")
    throw new ResponseError(400, "Fakultas ID is not valid");
  try {
    const fakultas = await prisma.fakultas.findUnique({
      where: {
        id: fakultasId,
      },
    });

    if (!fakultas) throw new ResponseError(404, "Fakultas not found");

    return findFakultasByIdResponse(fakultas);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// find all fakultas
const findAllFakultas = async () => {
  try {
    const fakultases = await prisma.fakultas.findMany();
    return fakultases;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// delete fakultas
const deleteFakultas = async (fakultasId) => {
  if (!fakultasId || typeof fakultasId !== "string")
    throw new ResponseError(400, "Fakultas ID is not valid");
  try {
    const fakultas = await prisma.fakultas.findUnique({
      where: {
        id: fakultasId,
      },
    });

    if (!fakultas) throw new ResponseError(404, "Fakultas not found");

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
