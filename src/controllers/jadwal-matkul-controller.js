import jadwalMatkulService from "../services/jadwal-matkul-service.js";

const createJadwalMataKuliah = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await jadwalMatkulService.createJadwalMataKuliah(req.body);

    // TODO kirim response
    res.status(201).json({
      status: 201,
      message: "Jadwal Mata Kuliah created successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const updateJadwalMataKuliah = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await jadwalMatkulService.updateJadwalMataKuliah(req.body);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Jadwal Mata Kuliah updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findJadwalMataKuliahById = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await jadwalMatkulService.findJadwalMataKuliahById(
      req.params.id
    );

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find Jadwal Mata Kuliah by Id successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findAllJadwalMataKuliah = async (req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const { hari } = req.query;

  try {
    // TODO panggil service
    const response = await jadwalMatkulService.findAllJadwalMataKuliah({
      hari,
      page,
      pageSize,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find All Jadwal Mata Kuliah successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const deleteJadwalMataKuliah = async (req, res, next) => {
  try {
    // TODO panggil service
    await jadwalMatkulService.deleteJadwalMataKuliahById(req.params.id);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message:
        "Jadwal Mata Kuliah with id " + req.params.id + " deleted successfully",
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default {
  createJadwalMataKuliah,
  updateJadwalMataKuliah,
  findJadwalMataKuliahById,
  findAllJadwalMataKuliah,
  deleteJadwalMataKuliah,
};
