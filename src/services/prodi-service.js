import { createProdiSchemaRequest } from "../dto/request/prodi/prodi-request.js";
import prisma from "../configs/db/prisma.js";
import { validate } from "../utils/validation-util.js";
import fakultasService from "./fakultas-service.js";
import {
  createProdiResponse,
  findProdiByIdResponse,
} from "../dto/response/prodi/prodi-response.js";
import ResponseError from "../errors/response-error.js";
import { v4 as uuid } from "uuid";

const createProdi = async (request) => {
  // validasi request
  const createProdiRequest = validate(createProdiSchemaRequest, request);

  try {
    // cek fakultas apakah ada
    const fakultas = await fakultasService.findFakultasByName(
      createProdiRequest.namaFakultas
    );

    // cek prodi apakah ada
    const prodiExist = await prisma.prodi.findFirst({
      where: {
        nama: createProdiRequest.nama,
        fakultasId: fakultas.id,
      },
    });

    // throw error jika prodi sudah ada
    if (prodiExist) throw new ResponseError(400, "Prodi already exist");

    // membuat prodi baru
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

const findProdiById = async (prodiId) => {
  // validasi prodi id
  if (!prodiId || typeof prodiId !== "string")
    throw new ResponseError(400, "Prodi ID is not valid");

  try {
    // cek apakah prodi sudah ada
    const prodi = await prisma.prodi.findUnique({
      where: {
        id: prodiId,
      },
      include: {
        fakultas: true,
      },
    });

    // throw error jika prodi tidak ada
    if (!prodi) throw new ResponseError(404, "Prodi not found");

    return findProdiByIdResponse(prodi);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const findProdiByName = async (prodiName) => {
  // validasi prodi name
  if (!prodiName || typeof prodiName !== "string")
    throw new ResponseError(400, "Prodi name is not valid");

  try {
    // cek apakah prodi sudah ada
    const prodi = await prisma.prodi.findFirst({
      where: {
        nama: prodiName,
      },
      include: {
        fakultas: true,
      },
    });

    // throw error jika prodi tidak ada
    if (!prodi) throw new ResponseError(404, "Prodi not found");

    return prodi;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default { createProdi, findProdiById, findProdiByName };
