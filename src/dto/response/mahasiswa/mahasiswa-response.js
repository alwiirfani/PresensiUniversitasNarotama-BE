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
    jadwal: findMahasiswa.mahasiswaJadwal.map((item) => {
      return {
        jadwalMataKuliahId: item.jadwalMataKuliahId,
        namaMataKuliah: item.jadwalMataKuliah.mataKuliah.nama,
        hari: item.jadwalMataKuliah.hari,
        jamMulai: item.jadwalMataKuliah.jamMulai,
        jamSelesai: item.jadwalMataKuliah.jamSelesai,
        ruangan: item.jadwalMataKuliah.ruangan,
        namaDosen: item.jadwalMataKuliah.dosen.nama,
      };
    }),

    createdAt: findMahasiswa.createdAt,
    updatedAt: findMahasiswa.updatedAt,
  };
};

export { updateMahasiswaResponse, findMahasiswaByNimResponse };
