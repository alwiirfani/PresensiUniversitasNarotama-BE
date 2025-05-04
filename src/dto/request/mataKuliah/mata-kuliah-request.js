import Joi from "joi";

const createNewMataKuliahSchemaRequest = Joi.object({
  kode: Joi.string().required(),
  nama: Joi.string().required(),
  sks: Joi.number().required(),
  namaProdi: Joi.string().required(),
});

const updateMataKuliahSchemaRequest = Joi.object({
  nama: Joi.string().required(),
  sks: Joi.number().required(),
  namaProdi: Joi.string().required(),
});

export { createNewMataKuliahSchemaRequest, updateMataKuliahSchemaRequest };
