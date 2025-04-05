import fakultasService from "../services/fakultas-service.js";

const createFakultas = async (req, res, next) => {
  try {
    const response = await fakultasService.createFakultas(req.body);
    res.status(201).json({
      status: 201,
      message: "Fakultas created successfully",
      data: response,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};

const deleteFakultas = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await fakultasService.deleteFakultas(id);
    res.status(200).json({
      status: 200,
      message: `Fakultas with name = ${response.name} deleted successfully`,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};

export default { createFakultas, deleteFakultas };
