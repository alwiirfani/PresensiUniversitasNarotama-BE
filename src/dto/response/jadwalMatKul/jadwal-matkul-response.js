const createJadwalMataKuliahResponse = (createdJadwal) => {
  return {
    id: createdJadwal.id,
    hari: createdJadwal.hari,
    jamMulai: createdJadwal.jamMulai,
    jamSelesai: createdJadwal.jamSelesai,
    ruangan: createdJadwal.ruangan,
    namaMataKuliah: createdJadwal.mataKuliah.nama,
    namaDosen: createdJadwal.dosen.nama,
    createdAt: createdJadwal.createdAt,
    updatedAt: createdJadwal.updatedAt,
  };
};

const updateJadwalMataKuliahResponse = (updatedJadwal) => {
  return {
    id: updatedJadwal.id,
    hari: updatedJadwal.hari,
    jamMulai: updatedJadwal.jamMulai,
    jamSelesai: updatedJadwal.jamSelesai,
    ruangan: updatedJadwal.ruangan,
    namaMataKuliah: updatedJadwal.mataKuliah.nama,
    namaDosen: updatedJadwal.dosen.nama,
    createdAt: updatedJadwal.createdAt,
    updatedAt: updatedJadwal.updatedAt,
  };
};

const findJadwalMataKuliahByIdResponse = (findJadwal) => {
  return {
    id: findJadwal.id,
    hari: findJadwal.hari,
    jamMulai: findJadwal.jamMulai,
    jamSelesai: findJadwal.jamSelesai,
    ruangan: findJadwal.ruangan,
    namaMataKuliah: findJadwal.mataKuliah.nama,
    namaDosen: findJadwal.dosen.nama,
    createdAt: findJadwal.createdAt,
    updatedAt: findJadwal.updatedAt,
  };
};

export {
  createJadwalMataKuliahResponse,
  updateJadwalMataKuliahResponse,
  findJadwalMataKuliahByIdResponse,
};
