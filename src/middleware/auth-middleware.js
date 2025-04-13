import "dotenv/config";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(403)
      .json({ status: 403, message: "A token is required for authentication" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: "Invalid Token" });
  }
};

const verifyTokenMahasiswa = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(403)
      .json({ status: 403, message: "A token is required for authentication" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decode);

    // verify role throw error if role is not mahasiswa
    if (decode.role !== "mahasiswa")
      return res.status(401).json({
        status: 401,
        message: "You are not authorized to access this resource",
      });

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: "Invalid Token" });
  }
};

const verifyTokenDosen = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(403)
      .json({ status: 403, message: "A token is required for authentication" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decode);

    // verify role throw error if role is not mahasiswa
    if (decode.role !== "dosen")
      return res.status(401).json({
        status: 401,
        message: "You are not authorized to access this resource",
      });

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: "Invalid Token" });
  }
};

const verifyTokenAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(403)
      .json({ status: 403, message: "A token is required for authentication" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decode);

    // verify role throw error if role is not mahasiswa
    if (decode.role !== "admin")
      return res.status(401).json({
        status: 401,
        message: "You are not authorized to access this resource",
      });

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: "Invalid Token" });
  }
};

export {
  verifyToken,
  verifyTokenMahasiswa,
  verifyTokenDosen,
  verifyTokenAdmin,
};
