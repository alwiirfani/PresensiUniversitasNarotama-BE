import dosenService from "../services/dosen-service.js";

const updateDosenForAdmin = async (req, res, next) => {
  try {
    // TODO panggil service
    const { dosenNip } = req.params;
    const response = await dosenService.updateDosenForAdmin(dosenNip, req.body);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Dosen updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const updateDosen = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await dosenService.updateDosen(req.body);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Dosen updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findDosenByNip = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await dosenService.findDosenByNip(req.params.dosenNip);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find Dosen by NIM successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findAllDosen = async (req, res, next) => {
  try {
    // TODO validate request
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { namaProdi } = req.query;

    // TODO panggil service
    const response = await dosenService.findAllDosen({
      namaProdi,
      page,
      pageSize,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find All Dosen successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const deleteDosen = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await dosenService.deleteDosen(req.params.dosenNip);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: `Dosen ${response.nama} deleted successfully`,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default {
  updateDosenForAdmin,
  updateDosen,
  findDosenByNip,
  findAllDosen,
  deleteDosen,
};
