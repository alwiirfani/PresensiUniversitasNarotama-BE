import Joi from "joi";

const registerAdminSchemaRequest = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(2).required(),
  confirmPassword: Joi.string().min(2).required(),
});

const loginAdminSchemaRequest = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(2).required(),
});

const registerDosenSchemaRequest = Joi.object({
  nip: Joi.string().required(5),
  nama: Joi.string().min(3).max(50).required(),
  namaProdi: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
  confirmPassword: Joi.string().min(2).required(),
  alamat: Joi.string().min(2).required(),
});

const loginDosenSchemaRequest = Joi.object({
  nip: Joi.string().required(5),
  password: Joi.string().min(2).required(),
});

const registerMahasiswaSchemaRequest = Joi.object({
  nim: Joi.string().required(8),
  nama: Joi.string().min(3).max(50).required(),
  namaProdi: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
  confirmPassword: Joi.string().min(2).required(),
  alamat: Joi.string().min(2).required(),
});

const loginMahasiswaSchemaRequest = Joi.object({
  nim: Joi.string().required(8),
  password: Joi.string().min(2).required(),
});

export {
  registerAdminSchemaRequest,
  loginAdminSchemaRequest,
  registerDosenSchemaRequest,
  loginDosenSchemaRequest,
  registerMahasiswaSchemaRequest,
  loginMahasiswaSchemaRequest,
};
