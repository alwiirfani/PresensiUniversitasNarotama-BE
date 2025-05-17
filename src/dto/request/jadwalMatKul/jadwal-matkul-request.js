import Joi from "joi";

const createJadwalMataKuliahSchemaRequest = Joi.object({
  hari: Joi.string().required(),
  jamMulai: Joi.string().required(),
  jamSelesai: Joi.string().required(),
  ruangan: Joi.string().required(),
  namaMataKuliah: Joi.string().required(),
  dosenNip: Joi.string().required(),
});

const updateJadwalMataKuliahSchemaRequest = Joi.object({
  id: Joi.string().min(3).required(),
  hari: Joi.string().optional(),
  jamMulai: Joi.string().optional(),
  jamSelesai: Joi.string().optional(),
  ruangan: Joi.string().optional(),
  namaMataKuliah: Joi.string().optional(),
  dosenNip: Joi.string().optional(),
});

export {
  createJadwalMataKuliahSchemaRequest,
  updateJadwalMataKuliahSchemaRequest,
};
