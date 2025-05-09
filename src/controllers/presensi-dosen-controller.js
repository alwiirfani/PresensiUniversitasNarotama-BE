import presensiDosenService from "../services/presensi-dosen-service.js";

const findAllPresensiDosen = async (req, res, next) => {
  try {
    const response = await presensiDosenService.findAllPresensiDosen();
    res.status(200).json({
      status: 200,
      message: "Find all presensi dosen successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching presensi:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { findAllPresensiDosen };
