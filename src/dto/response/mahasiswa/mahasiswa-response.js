const updateMahasiswaResponse = (updateMahasiswa) => {
  return {
    nim: updateMahasiswa.nim,
    nama: updateMahasiswa.nama,
    namaProdi: updateMahasiswa.prodi.nama,
    email: updateMahasiswa.email,
    alamat: updateMahasiswa.alamat,
    createdAt: updateMahasiswa.createdAt,
    updatedAt: updateMahasiswa.updatedAt,
  };
};

const findMahasiswaByNimResponse = (findMahasiswa) => {
  return {
    nim: findMahasiswa.nim,
    nama: findMahasiswa.nama,
    namaProdi: findMahasiswa.prodi.nama,
    email: findMahasiswa.email,
    alamat: findMahasiswa.alamat,
    mataKuliah: findMahasiswa.mahasiswaJadwal.map((item) => {
      return {
        nama: item.jadwalMataKuliah.mataKuliah.nama,
      };
    }),
    jadwalMataKuliah: findMahasiswa.mahasiswaJadwal.map((item) => {
      return {
        jadwalMataKuliahId: item.jadwalMataKuliahId,
      };
    }),
    createdAt: findMahasiswa.createdAt,
    updatedAt: findMahasiswa.updatedAt,
  };
};

export { updateMahasiswaResponse, findMahasiswaByNimResponse };
