import authService from "../services/auth-service.js";

const registerAdmin = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await authService.registerAdmin(req.body);

    // TODO kirim response
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
    // TODO panggil service
    const response = await authService.loginAdmin(req.body);

    // TODO response cookie
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Lakukan pengecekan CSRF
    });

    // TODO kirim response
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
    // TODO panggil service
    const response = await authService.registerMahasiswa(req.body);

    // TODO kirim response
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
    // TODO panggil service
    const response = await authService.loginMahasiswa(req.body);

    // TODO response cookie
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production",
    });

    // TODO kirim response
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

const refreshToken = async (req, res, next) => {
  try {
    // TODO panggil service
    const response = await authService.refreshToken(req.cookies.refreshToken);

    // TODO response
    res.status(200).json({
      status: 200,
      message: "Token refreshed successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const logout = async (req, res, next) => {
  try {
    // TODO panggil service
    await authService.logout(req.cookies.refreshToken);

    // hapus cookie
    res.clearCookie("refreshToken");

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Logout successfully",
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
  refreshToken,
  logout,
};
