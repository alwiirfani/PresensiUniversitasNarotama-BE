const createNewMataKuliahResponse = (createNewMataKuliah) => {
  return {
    kode: createNewMataKuliah.kode,
    nama: createNewMataKuliah.nama,
    sks: createNewMataKuliah.sks,
    prodi: createNewMataKuliah.prodi.nama,
    createdAt: createNewMataKuliah.createdAt,
  };
};

export { createNewMataKuliahResponse };
