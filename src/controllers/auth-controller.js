import authService from "../services/auth-service.js";

const registerAdmin = async (req, res, next) => {
  try {
    // panggil service
    const response = await authService.registerAdmin(req.body);

    // kirim response
    res.status(201).json({
      status: 201,
      message: "Admin created successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    // panggil service
    const response = await authService.loginAdmin(req.body);

    // kirim response
    res.status(200).json({
      status: 200,
      message: "Admin logged in successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const registerMahasiswa = async (req, res, next) => {
  try {
    // panggil service
    const response = await authService.registerMahasiswa(req.body);

    // kirim response
    res.status(201).json({
      status: 201,
      message: "Mahasiswa created successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const loginMahasiswa = async (req, res, next) => {
  try {
    // panggil service
    const response = await authService.loginMahasiswa(req.body);

    // kirim response
    res.status(200).json({
      status: 200,
      message: "Mahasiswa logged in successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default {
  registerAdmin,
  loginAdmin,
  registerMahasiswa,
  loginMahasiswa,
};
