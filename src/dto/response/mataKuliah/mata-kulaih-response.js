const createNewMataKuliahResponse = (createNewMataKuliah) => {
  return {
    kode: createNewMataKuliah.kode,
    nama: createNewMataKuliah.nama,
    sks: createNewMataKuliah.sks,
    prodi: createNewMataKuliah.prodi.nama,
    createdAt: createNewMataKuliah.createdAt,
  };
};

const updateMataKuliahResponse = (updateMataKuliah) => {
  return {
    kode: updateMataKuliah.kode,
    nama: updateMataKuliah.nama,
    sks: updateMataKuliah.sks,
    prodi: updateMataKuliah.prodi.nama,
    updatedAt: updateMataKuliah.updatedAt,
  };
};

const findMataKuliahByKodeResponse = (findMataKuliah) => {
  return {
    kode: findMataKuliah.kode,
    nama: findMataKuliah.nama,
    sks: findMataKuliah.sks,
    prodi: findMataKuliah.prodi.nama,
    createdAt: findMataKuliah.createdAt,
    updatedAt: findMataKuliah.updatedAt,
  };
};

export {
  createNewMataKuliahResponse,
  updateMataKuliahResponse,
  findMataKuliahByKodeResponse,
};
