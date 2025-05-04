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

const updateManyMataKuliahMahasiswaSchemaRequest = Joi.object({
  mataKuliah: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      "array.base": `"mataKuliah" harus berupa array`,
      "array.min": `"mataKuliah" harus memiliki minimal 1 mata kuliah`,
      "any.required": `"mataKuliah" harus diisi`,
    }),
  semester: Joi.number().integer().min(1).optional().messages({
    "number.base": `"semester" harus berupa angka`,
    "number.integer": `"semester" harus berupa angka bulat`,
    "number.min": `"semester" harus lebih besar dari 0`,
  }),
});

export {
  updateMahasiswaForAdminSchemaRequest,
  updateMahasiswaSchemaRequest,
  updateManyMataKuliahMahasiswaSchemaRequest,
};
