import prisma from "../manager/db/prisma.js";

const findAllPresensiDosen = async () => {
  return await prisma.presensiDosen.findMany({
    select: {
      id: true,
      status: true,
      scanTime: true,
      tanggal: true,
      dosen: {
        select: {
          nama: true,
          prodi: {
            select: { nama: true, fakultas: { select: { nama: true } } },
          },
        },
      },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export default { findAllPresensiDosen };
