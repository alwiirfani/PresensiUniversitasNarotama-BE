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
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const updateFakultas = async (req, res, next) => {
  try {
    const fakultas = await fakultasService.updateFakultas(req.body);

    res.status(200).json({
      status: 200,
      message: "Fakultas updated successfully",
      data: fakultas,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

const findFakultasById = async (req, res, next) => {
  try {
    const fakultas = await fakultasService.findFakultasById(req.params.id);

    res.status(200).json({
      status: 200,
      message: "Fakultas found successfully",
      data: fakultas,
    });
  } catch (error) {
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
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
    const status = error.status || 500;
    next(res.status(status).json({ status: status, message: error.message }));
  }
};

export default {
  createFakultas,
  updateFakultas,
  findFakultasById,
  deleteFakultas,
};
