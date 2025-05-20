import Joi from "joi";

const createNewMataKuliahSchemaRequest = Joi.object({
  kode: Joi.string().required(),
  dosenNip: Joi.string().required(),
  nama: Joi.string().required(),
  sks: Joi.number().required(),
  tahunAjaran: Joi.string().required(),
  semester: Joi.number().required(),
  namaProdi: Joi.string().required(),
});

const updateMataKuliahSchemaRequest = Joi.object({
  kode: Joi.string().required(),
  dosenNip: Joi.string().required(),
  nama: Joi.string().required(),
  sks: Joi.number().required(),
  tahunAjaran: Joi.string().required(),
  semester: Joi.number().required(),
  namaProdi: Joi.string().required(),
});

export { createNewMataKuliahSchemaRequest, updateMataKuliahSchemaRequest };
