const createFakultasResponse = (createFakultas) => {
  return {
    id: createFakultas.id,
    nama: createFakultas.nama,
    dekan: createFakultas.dekan,
    createdAt: createFakultas.createdAt,
  };
};

const updateFakultasResponse = (updateFakultas) => {
  return {
    id: updateFakultas.id,
    nama: updateFakultas.nama,
    dekan: updateFakultas.dekan,
    createdAt: updateFakultas.createdAt,
    updatedAt: updateFakultas.updatedAt,
  };
};

const findFakultasByIdResponse = (findFakultas) => {
  return {
    id: findFakultas.id,
    nama: findFakultas.nama,
    dekan: findFakultas.dekan,
    createdAt: findFakultas.createdAt,
    updatedAt: findFakultas.updatedAt,
    prodi: findFakultas.prodi,
  };
};

export {
  createFakultasResponse,
  updateFakultasResponse,
  findFakultasByIdResponse,
};
