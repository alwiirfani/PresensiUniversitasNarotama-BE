import Joi from "joi";

const createFakultasSchemaRequest = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  dekan: Joi.string().min(3).max(50).optional(),
});

export { createFakultasSchemaRequest };
