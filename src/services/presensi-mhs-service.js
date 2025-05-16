import prisma from "../manager/db/prisma.js";
import ResponseError from "../errors/response-error.js";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

const generateQrCode = async ({ mahasiswaNim, jadwalMataKuliahId }) => {
  try {
    const qRCodeExist = await prisma.mahasiswaQRCode.findFirst({
      where: {
        mahasiswaNim: mahasiswaNim,
        jadwalMataKuliahId: jadwalMataKuliahId,
        expiredAt: { gt: new Date() },
        isUsed: false,
      },
    });

    if (qRCodeExist) {
      return qRCodeExist;
    }

    const generateQRToken = uuid(); // TODO generate qr token
    const expiredAt = dayjs().add(5, "minute").toDate(); // TODO generate expired at (5 minute)

    return await prisma.mahasiswaQRCode.create({
      data: {
        id: uuid().toString(),
        mahasiswaNim: mahasiswaNim,
        jadwalMataKuliahId: jadwalMataKuliahId,
        qrToken: generateQRToken,
        expiredAt: expiredAt,
      },
    });
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

const errorQrCodeNotFound = async (qr, qrToken, dosenNip) => {
  if (!qr) {
    await prisma.scanLog.create({
      data: {
        id: uuid().toString(),
        qrToken,
        status: "FAILED_INVALID",
        errorMessage: "QR Code not found",
        jadwalMataKuliahId: qr.jadwalMataKuliahId,
        mahasiswaNim: qr.mahasiswaNim,
        scannedByDosenNip: dosenNip,
      },
    });
    throw new ResponseError(404, "QR Code not found");
  }
};

const errorExpiredQrCode = async (qr, qrToken, dosenNip) => {
  if (qr.expiredAt < new Date()) {
    await prisma.scanLog.create({
      data: {
        id: uuid().toString(),
        qrToken,
        status: "FAILED_EXPIRED",
        errorMessage: "QR Code expired",
        jadwalMataKuliahId: qr.jadwalMataKuliahId,
        mahasiswaNim: qr.mahasiswaNim,
        scannedByDosenNip: dosenNip,
      },
    });
    throw new ResponseError(400, "QR Code expired");
  }
};

const verifyQrCode = async ({ dosenNip, qrToken }) => {
  const qr = await prisma.mahasiswaQRCode.findFirst({
    where: {
      qrToken: qrToken,
      expiredAt: { gt: new Date() },
      isUsed: false,
    },
    include: {
      mahasiswa: true,
      jadwalMataKuliah: true,
    },
  });

  // TODO handle error
  await errorQrCodeNotFound(qr, qrToken, dosenNip);
  await errorExpiredQrCode(qr, qrToken, dosenNip);

  await prisma.scanLog.create({
    data: {
      id: uuid().toString(),
      qrToken,
      status: "SUCCESS",
      jadwalMataKuliahId: qr.jadwalMataKuliahId,
      mahasiswaNim: qr.mahasiswaNim,
      scannedByDosenNip: dosenNip,
    },
  });

  // TODO update qr code
  await prisma.mahasiswaQRCode.update({
    where: { id: qr.id },
    data: { isUsed: true, usedAt: new Date() },
  });

  return await prisma.presensiMahasiswa.create({
    data: {
      mahasiswaNim: qr.mahasiswaNim,
      jadwalMataKuliahId: qr.jadwalMataKuliahId,
      tanggal: new Date(),
      status: "HADIR",
      qrTokenUsed: qrToken,
      verifiedByDosenNip: dosenNip,
      qrCodeId: qr.id,
      createdAt: new Date(),
    },
  });
};

export default { generateQrCode, verifyQrCode };
