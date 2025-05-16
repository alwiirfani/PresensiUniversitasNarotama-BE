import mataKuliahService from "../services/mata-kuliah-service.js";

const createMataKuliah = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await mataKuliahService.createMataKuliah(req.body);

    // TODO kirim response
    res.status(201).json({
      status: 201,
      message: "Mata Kuliah created successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const updateMataKuliah = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await mataKuliahService.updateMataKuliah(req.body);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Mata Kuliah updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findMataKuliahByKode = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await mataKuliahService.findMataKuliahByKode(
      req.params.kode
    );

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find Mata Kuliah by Kode successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findAllMataKuliah = async (req, res, next) => {
  try {
    // TODO validasi input
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { namaProdi } = req.query;

    // TODO panggil service
    const response = await mataKuliahService.findAllMataKuliah({
      page,
      pageSize,
      namaProdi,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find All Mata Kuliah successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const deleteMataKuliah = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await mataKuliahService.deleteMataKuliah(req.params.kode);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: `Mata Kuliah ${response.nama} deleted successfully`,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};
export default {
  createMataKuliah,
  updateMataKuliah,
  findMataKuliahByKode,
  findAllMataKuliah,
  deleteMataKuliah,
};
