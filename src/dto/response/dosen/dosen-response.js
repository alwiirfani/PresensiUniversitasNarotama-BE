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

const findDosenByNipResponse = (dosen) => ({
  nip: dosen.nip,
  nama: dosen.nama,
  email: dosen.email,
  alamat: dosen.alamat,
  createdAt: dosen.createdAt,
  updatedAt: dosen.updatedAt,
  prodi: dosen.prodi,
  matakuliah: dosen.dosenMatakuliah.map((dm) => ({
    kode: dm.mataKuliah.kode,
    nama: dm.mataKuliah.nama,
    jadwal: dm.mataKuliah.jadwalMataKuliah,
  })),
});

export { updateDosenResponse, findDosenByNipResponse };
