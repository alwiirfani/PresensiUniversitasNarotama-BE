const createProdiResponse = (createProdi) => {
  return {
    id: createProdi.id,
    nama: createProdi.nama,
    kode: createProdi.kode,
    fakultas: createProdi.fakultas.nama,
    createdAt: createProdi.createdAt,
  };
};

const updateProdiResponse = (updateProdi) => {
  return {
    id: updateProdi.id,
    nama: updateProdi.nama,
    kode: updateProdi.kode,
    fakultas: updateProdi.fakultas.nama,
    createdAt: updateProdi.createdAt,
    updatedAt: updateProdi.updatedAt,
  };
};

const findProdiByIdResponse = (findProdi) => {
  return {
    id: findProdi.id,
    nama: findProdi.nama,
    kode: findProdi.kode,
    fakultas: findProdi.fakultas.nama,
    createdAt: findProdi.createdAt,
    updatedAt: findProdi.updatedAt,
  };
};

export { createProdiResponse, updateProdiResponse, findProdiByIdResponse };
