const registerAdminResponse = (registerAdmin) => {
  return {
    pin: registerAdmin.pin,
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

const registerDosenResponse = (registerDosen) => {
  return {
    nip: registerDosen.nip,
    nama: registerDosen.nama,
    prodi: registerDosen.prodi.nama,
    email: registerDosen.email,
    alamat: registerDosen.alamat,
    createdAt: registerDosen.createdAt,
  };
};

export {
  registerAdminResponse,
  registerMahasiswaResponse,
  registerDosenResponse,
};
