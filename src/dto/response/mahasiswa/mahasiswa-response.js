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

const findMahasiswaByNimResponse = (mahasiswa) => {
  return {
    nim: mahasiswa.nim,
    nama: mahasiswa.nama,
    namaProdi: mahasiswa.prodi,
    email: mahasiswa.email,
    alamat: mahasiswa.alamat,
    jadwal: mahasiswa.mahasiswaJadwal.map((item) => ({
      jadwalMataKuliahId: item.jadwalMataKuliahId,
      namaMataKuliah: item.jadwalMataKuliah.mataKuliah.nama,
      hari: item.jadwalMataKuliah.hari,
      jamMulai: item.jadwalMataKuliah.jamMulai,
      jamSelesai: item.jadwalMataKuliah.jamSelesai,
      ruangan: item.jadwalMataKuliah.ruangan,
      namaDosen: item.jadwalMataKuliah.dosen.nama,
    })),

    createdAt: mahasiswa.createdAt,
    updatedAt: mahasiswa.updatedAt,
  };
};

export { updateMahasiswaResponse, findMahasiswaByNimResponse };
