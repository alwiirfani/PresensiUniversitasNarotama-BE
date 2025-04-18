import prodiService from "../services/prodi-service.js";

const createProdi = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await prodiService.createProdi(req.body);

    // TODO kirim response
    res.status(201).json({
      status: 201,
      message: "Prodi created successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const updateProdi = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await prodiService.updateProdi(req.body);

    // TODO kirim response
    res.status.json({
      status: 200,
      message: "Prodi updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findProdiById = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await prodiService.findProdiById(req.params.id);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find Prodi by Id successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findAllProdi = async (req, res, next) => {
  try {
    // TODO validasi input
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { nama, kode } = req.query;

    // TODO panggil service
    const response = await prodiService.findAllProdi({
      page,
      pageSize,
      nama,
      kode,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find All Prodi successfully",
      data: response.data,
      pagination: response.pagination,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const deleteProdi = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await prodiService.deleteProdi(req.params.id);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: `Prodi ${response.name} deleted successfully`,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default {
  createProdi,
  updateProdi,
  findProdiById,
  findAllProdi,
  deleteProdi,
};
