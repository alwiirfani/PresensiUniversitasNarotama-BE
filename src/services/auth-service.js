import {
  loginAdminSchemaRequest,
  loginMahasiswaSchemaRequest,
  registerAdminSchemaRequest,
  registerMahasiswaSchemaRequest,
} from "../dto/request/authentication/auth-request.js";
import {
  registerAdminResponse,
  registerMahasiswaResponse,
} from "../dto/response/authentication/auth-response.js";
import "dotenv/config";
import prisma from "../configs/db/prisma.js";
import jwt from "jsonwebtoken";
import { validate } from "../utils/validation-util.js";
import ResponseError from "../errors/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import prodiService from "./prodi-service.js";

// resgister admin
const registerAdmin = async (request) => {
  // validasi request
  const registerAdminRequest = validate(registerAdminSchemaRequest, request);

  try {
    // cek password dan confirm password
    if (registerAdminRequest.password !== registerAdminRequest.confirmPassword)
      throw new ResponseError(
        400,
        "Password and confirm password must be same"
      );

    // cek apakah username sudah terdaftar
    const adminExist = await prisma.admin.findUnique({
      where: {
        username: registerAdminRequest.username,
      },
    });

    // throw error jika username sudah terdaftar
    if (adminExist) throw new ResponseError(400, "Username already exist");

    // hash password
    const hashedPassword = await bcrypt.hash(registerAdminRequest.password, 10);

    // buat admin
    const newAdmin = await prisma.admin.create({
      data: {
        id: uuid().toString(),
        username: registerAdminRequest.username,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });

    return registerAdminResponse(newAdmin);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// login admin
const loginAdmin = async (request) => {
  // validasi request
  const loginAdminRequest = validate(loginAdminSchemaRequest, request);

  try {
    // cek admin
    const admin = await prisma.admin.findUnique({
      where: {
        username: loginAdminRequest.username,
      },
    });

    // cek apakah admin sudah terdaftar throw error
    if (!admin)
      throw new ResponseError(
        404,
        `Admin with username ${loginAdminRequest.username} not found`
      );

    // cek password
    const isPasswordMatch = await bcrypt.compare(
      loginAdminRequest.password,
      admin.password
    );

    // throw error jika password salah
    if (!isPasswordMatch) throw new ResponseError(400, "Password is incorrect");

    // buat token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1d",
        subject: admin.username,
      }
    );

    return {
      id: admin.id,
      username: admin.username,
      role: "admin",
      token: token,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// register mahasiswa
const registerMahasiswa = async (request) => {
  const registerMahasiswaRequest = validate(
    registerMahasiswaSchemaRequest,
    request
  );

  try {
    // cek prodi apakah ada
    const prodi = await prodiService.findProdiByName(
      registerMahasiswaRequest.namaProdi
    );

    // cek password dan confirm password
    if (
      registerMahasiswaRequest.password !==
      registerMahasiswaRequest.confirmPassword
    )
      throw new ResponseError(
        400,
        "Password and confirm password must be same"
      );

    // cek apakah nim sudah terdaftar
    const mahasiswaExist = await prisma.mahasiswa.findUnique({
      where: {
        nim: registerMahasiswaRequest.nim,
        prodiId: prodi.id,
      },
    });

    // throw error jika nim sudah terdaftar
    if (mahasiswaExist) throw new ResponseError(400, "NIM already exist");

    // hash password
    const hashedPassword = await bcrypt.hash(
      registerMahasiswaRequest.password,
      10
    );

    // buat mahasiswa
    const newMahasiswa = await prisma.mahasiswa.create({
      data: {
        nim: registerMahasiswaRequest.nim,
        nama: registerMahasiswaRequest.nama,
        prodiId: prodi.id,
        email: registerMahasiswaRequest.email,
        password: hashedPassword,
        alamat: registerMahasiswaRequest.alamat,
        createdAt: new Date(),
      },
      include: {
        prodi: true,
      },
    });

    return registerMahasiswaResponse(newMahasiswa);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// login mahasiswa
const loginMahasiswa = async (request) => {
  // validasi request
  const loginMahasiswaRequest = validate(loginMahasiswaSchemaRequest, request);

  try {
    // cek mahasiswa
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: {
        nim: loginMahasiswaRequest.nim,
      },
      include: {
        prodi: true,
      },
    });

    // cek apakah mahasiswa sudah terdaftar throw error
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

    // buat token
    const token = jwt.sign(
      {
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        role: "mahasiswa",
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
        subject: mahasiswa.email,
      }
    );

    return {
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      role: "mahasiswa",
      token: token,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default { registerAdmin, loginAdmin, registerMahasiswa, loginMahasiswa };
