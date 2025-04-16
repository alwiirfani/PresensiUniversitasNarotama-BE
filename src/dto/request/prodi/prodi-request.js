import Joi from "joi";

const createProdiSchemaRequest = Joi.object({
  nama: Joi.string().min(3).max(50).required(),
  namaFakultas: Joi.string().min(3).required(),
  kode: Joi.string().min(1).max(3).required(),
});

export { createProdiSchemaRequest };
