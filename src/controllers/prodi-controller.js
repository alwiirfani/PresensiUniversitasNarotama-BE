import prodiService from "../services/prodi-service.js";

const createProdi = async (req, res, next) => {
  try {
    const response = await prodiService.createProdi(req.body);

    // kirim response
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

export default {
  createProdi,
};
