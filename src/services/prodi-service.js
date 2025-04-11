import { createProdiSchemaRequest } from "../dto/request/prodi/prodi-request.js";
import prisma from "../configs/db/prisma.js";
import { validate } from "../utils/validation-util.js";
import fakultasService from "./fakultas-service.js";
import { createProdiResponse } from "../dto/response/prodi/prodi-response.js";
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
        fakultas: {
          select: {
            id: true,
            nama: true,
            dekan: true,
          },
        },
      },
    });

    return createProdiResponse(createProdi);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default { createProdi };
