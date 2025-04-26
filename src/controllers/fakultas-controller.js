import fakultasService from "../services/fakultas-service.js";

const createFakultas = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await fakultasService.createFakultas(req.body);

    // TODO kirim response
    res.status(201).json({
      status: 201,
      message: "Fakultas created successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const updateFakultas = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await fakultasService.updateFakultas(req.body);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Fakultas updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findFakultasById = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await fakultasService.findFakultasById(req.params.id);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find Fakultas by Id successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findAllFakultas = async (req, res, next) => {
  try {
    // TODO validasi input
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { nama, dekan } = req.query;

    // TODO find all fakultas
    const response = await fakultasService.findAllFakultas({
      page,
      pageSize,
      nama,
      dekan,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find All Fakultas successfully",
      data: response.data,
      pagination: response.pagination,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const deleteFakultas = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await fakultasService.deleteFakultas(req.params.id);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: `Fakultas ${response.nama} deleted successfully`,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default {
  createFakultas,
  updateFakultas,
  findFakultasById,
  findAllFakultas,
  deleteFakultas,
};
