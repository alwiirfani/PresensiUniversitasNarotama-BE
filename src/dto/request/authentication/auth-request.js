import Joi from "joi";

const registerMahasiswaSchemaRequest = Joi.object({
  nim: Joi.string().min(3).max(7).required(),
});

const loginMahasiswaSchemaRequest = Joi.object({
  nim: Joi.string().min(3).max(7).required(),
  password: Joi.string().min(2).required(),
});

export { registerMahasiswaSchemaRequest, loginMahasiswaSchemaRequest };
