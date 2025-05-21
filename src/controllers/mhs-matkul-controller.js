import mhsMatkulService from "../services/mhs-matkul-service.js";

const updateManyMataKuliahMahasiswa = async (req, res, next) => {
  const { mahasiswaNim } = req.params;

  try {
    // TODO panggil service
    const response = await mhsMatkulService.updateManyMataKuliahMahasiswa(
      mahasiswaNim,
      req.body
    );

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

export default { updateManyMataKuliahMahasiswa };
