import prisma from "../manager/db/prisma.js";

const findAllPresensiDosen = async () => {
  return await prisma.presensiDosen.findMany({
    include: { dosen: true, jadwalMataKuliah: true },
    orderBy: { createdAt: "desc" },
  });
};

export default { findAllPresensiDosen };
