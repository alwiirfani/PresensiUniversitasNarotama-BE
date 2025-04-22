import Joi from "joi";

const updateDosenForAdminSchemaRequest = Joi.object({
  nama: Joi.string().min(3).max(50).required(),
  namaProdi: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  alamat: Joi.string().min(2).required(),
});

const updateDosenSchemaRequest = Joi.object({
  nip: Joi.string().min(3).max(5).required(),
  password: Joi.string().min(2).optional(),
  confirmPassword: Joi.string().min(2).optional(),
  nama: Joi.string().min(3).max(50).required(),
  namaProdi: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  alamat: Joi.string().min(2).required(),
});

export { updateDosenForAdminSchemaRequest, updateDosenSchemaRequest };
