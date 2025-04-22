import Joi from "joi";

const updateMahasiswaForAdminSchemaRequest = Joi.object({
  nama: Joi.string().min(3).max(50).required(),
  namaProdi: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  alamat: Joi.string().min(2).required(),
});

const updateMahasiswaSchemaRequest = Joi.object({
  nim: Joi.string().min(3).max(7).required(),
  password: Joi.string().min(2).optional(),
  confirmPassword: Joi.string().min(2).optional(),
  nama: Joi.string().min(3).max(50).required(),
  namaProdi: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  alamat: Joi.string().min(2).required(),
});

export { updateMahasiswaForAdminSchemaRequest, updateMahasiswaSchemaRequest };
