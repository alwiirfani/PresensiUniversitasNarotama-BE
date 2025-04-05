import "dotenv/config";
import prisma from "../configs/db/prisma.js";
import jwt from "jsonwebtoken";
import validate from "../utils/validation-util.js";
import {
  loginMahasiswaSchemaRequest,
  registerMahasiswaSchemaRequest,
} from "../dto/request/authentication/auth-request.js";
import ResponseError from "../errors/response.error.js";

// register mahasiswa
const registerMahasiswa = async (request) => {
  const registerMahasiswaRequest = validate(
    registerMahasiswaSchemaRequest,
    request
  );

  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: {
        nim: registerMahasiswaRequest.nim,
      },
    });
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// login mahasiswa
const loginMahasiswa = async (request) => {
  const loginMahasiswaRequest = validate(loginMahasiswaSchemaRequest, request);

  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: {
        nim: loginMahasiswaRequest.nim,
      },
      select: {
        nim: true,
        password: true,
        fakultasId: true,
      },
      include: {
        fakultas: true,
      },
    });

    // check if mahasiswa exist
    if (!mahasiswa)
      throw new ResponseError(
        404,
        `Mahasiswa with NIM ${loginMahasiswaRequest.nim} not found`
      );

    // verify password
    const isPasswordValid = await bcrypt.compare(
      loginMahasiswaRequest.password,
      mahasiswa.password
    );

    if (!isPasswordValid) throw new ResponseError(401, "Invalid password");

    // generate token
    const token = jwt.sign(
      {
        nim: mahasiswa.nim,
        fakultasId: mahasiswa.fakultasId,
        role: "mahasiswa",
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
        subject: mahasiswa.email,
      }
    );

    res.json({
      status: 200,
      message: "Login success",
      data: {
        token: token,
      },
    });
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export { registerMahasiswa, loginMahasiswa };
