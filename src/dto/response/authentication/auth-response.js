const registerAdminResponse = (registerAdmin) => {
  return {
    id: registerAdmin.id,
    username: registerAdmin.username,
    createdAt: registerAdmin.createdAt,
  };
};
const registerMahasiswaResponse = (registerMahasiswa) => {
  return {
    nim: registerMahasiswa.nim,
    nama: registerMahasiswa.nama,
    prodi: registerMahasiswa.prodi.nama,
    email: registerMahasiswa.email,
    alamat: registerMahasiswa.alamat,
    createdAt: registerMahasiswa.createdAt,
  };
};

export { registerAdminResponse, registerMahasiswaResponse };
