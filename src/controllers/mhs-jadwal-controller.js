import mhsJadwalService from "../services/mhs-jadwal-service.js";

const updateManyJadwalMahasiswa = async (req, res, next) => {
  const { mahasiswaNim } = req.params;

  try {
    // TODO panggil service
    const response = await mhsJadwalService.updateManyJadwalMahasiswa(
      mahasiswaNim,
      req.body
    );

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "Jadwal updated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default { updateManyJadwalMahasiswa };
