import presensiMhsService from "../services/presensi-mhs-service.js";

const generateQrCode = async (req, res, next) => {
  try {
    const { mahasiswaNim } = req.body;
    const { jadwalMataKuliahId } = req.params;

    // TODO panggil service
    const response = await presensiMhsService.generateQrCode({
      mahasiswaNim: mahasiswaNim,
      jadwalMataKuliahId: jadwalMataKuliahId,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "QR Code generated successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const scanQrCode = async (req, res, next) => {
  try {
    const { dosenNip } = req.body;
    const { jadwalMataKuliahId } = req.params;

    // TODO panggil service
    const response = await presensiMhsService.verifyQrCode({
      dosenNip: dosenNip,
      jadwalMataKuliahId: jadwalMataKuliahId,
    });

    // TODO kirim response
    res.status(200).json({
      status: 200,
      message: "QR Code scanned successfully",
      data: response,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default { generateQrCode, scanQrCode };
