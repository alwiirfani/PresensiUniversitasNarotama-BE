const createProdiResponse = (createProdi) => {
  return {
    id: createProdi.id,
    nama: createProdi.nama,
    fakultasId: createProdi.fakultasId,
    createdAt: createProdi.createdAt,
  };
};

export { createProdiResponse };
