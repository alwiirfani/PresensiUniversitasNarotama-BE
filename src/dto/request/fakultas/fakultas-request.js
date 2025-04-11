import Joi from "joi";

const createFakultasSchemaRequest = Joi.object({
  nama: Joi.string().min(3).max(50).required(),
  dekan: Joi.string().min(3).max(50).optional(),
});

const updateFakultasSchemaRequest = Joi.object({
  id: Joi.string().min(3).required(),
  nama: Joi.string().min(3).max(50).required(),
  dekan: Joi.string().min(3).max(50).optional(),
});

export { createFakultasSchemaRequest, updateFakultasSchemaRequest };
