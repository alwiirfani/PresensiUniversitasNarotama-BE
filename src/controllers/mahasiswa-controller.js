import mahasiswaService from "../services/mahasiswa-service.js";

const updateMahasiswaForAdmin = async (req, res, next) => {
  try {
    // TODO panggil service
    const { mahasiswaNim } = req.params;
    const response = await mahasiswaService.updateMahasiswaForAdmin(
      mahasiswaNim,
      req.body
    );

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Mahasiswa updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const updateMahasiswa = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await mahasiswaService.updateMahasiswa(req.body);

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Mahasiswa updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findMahasiswaByNim = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await mahasiswaService.findMahasiswaByNim(
      req.params.mahasiswaNim
    );

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find Mahasiswa by NIM successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findAllMahasiswa = async (req, res, next) => {
  try {
    // TODO validate request
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { namaProdi } = req.query;

    // TODO panggil service
    const response = await mahasiswaService.findAllMahasiswa({
      namaProdi,
      page,
      pageSize,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Find All Mahasiswa successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const deleteMahasiswa = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await mahasiswaService.deleteMahasiswa(
      req.params.mahasiswaNim
    );

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: `Mahasiswa ${response.nama} deleted successfully`,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default {
  updateMahasiswaForAdmin,
  updateMahasiswa,
  findMahasiswaByNim,
  findAllMahasiswa,
  deleteMahasiswa,
};
