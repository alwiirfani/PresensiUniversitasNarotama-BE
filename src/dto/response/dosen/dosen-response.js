const updateDosenResponse = (updateDosen) => {
  return {
    nip: updateDosen.nip,
    nama: updateDosen.nama,
    namaProdi: updateDosen.prodi.nama,
    email: updateDosen.email,
    alamat: updateDosen.alamat,
    createdAt: updateDosen.createdAt,
    updatedAt: updateDosen.updatedAt,
  };
};
const findDosenByNipResponse = (findDosen) => {
  return {
    nip: findDosen.nip,
    nama: findDosen.nama,
    namaProdi: findDosen.prodi.nama,
    email: findDosen.email,
    alamat: findDosen.alamat,
    createdAt: findDosen.createdAt,
    updatedAt: findDosen.updatedAt,
  };
};

export { updateDosenResponse, findDosenByNipResponse };
