import fakultasService from "../services/fakultas-service.js";

const createFakultas = async (req, res, next) => {
  try {
    // panggil service
    const response = await fakultasService.createFakultas(req.body);

    // kirim response
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
    // panggil service
    const fakultas = await fakultasService.updateFakultas(req.body);

    // kirim response
    res.status(200).json({
      status: 200,
      message: "Fakultas updated successfully",
      data: fakultas,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findFakultasById = async (req, res, next) => {
  try {
    // panggil service
    const fakultas = await fakultasService.findFakultasById(req.params.id);

    // kirim response
    res.status(200).json({
      status: 200,
      message: "FInd Fakultas by Id successfully",
      data: fakultas,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findAllFakultas = async (req, res, next) => {
  try {
    // validasi input
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { nama, dekan } = req.query;

    // find all fakultas
    const result = await fakultasService.findAllFakultas({
      page,
      pageSize,
      nama,
      dekan,
    });

    // kirim response
    res.status(200).json({
      status: 200,
      message: "Find All Fakultas successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const deleteFakultas = async (req, res, next) => {
  try {
    // panggil service
    const response = await fakultasService.deleteFakultas(req.params.id);

    // kirim response
    res.status(200).json({
      status: 200,
      message: `Fakultas ${response.name} deleted successfully`,
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
