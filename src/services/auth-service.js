import {
  loginAdminSchemaRequest,
  loginDosenSchemaRequest,
  loginMahasiswaSchemaRequest,
  registerAdminSchemaRequest,
  registerDosenSchemaRequest,
  registerMahasiswaSchemaRequest,
} from "../dto/request/authentication/auth-request.js";
import {
  registerAdminResponse,
  registerDosenResponse,
  registerMahasiswaResponse,
} from "../dto/response/authentication/auth-response.js";
import "dotenv/config";
import prisma from "../manager/db/prisma.js";
import jwt from "jsonwebtoken";
import { validate } from "../utils/validation-util.js";
import ResponseError from "../errors/response-error.js";
import bcrypt from "bcrypt";
import prodiService from "./prodi-service.js";

// TODO resgister admin
const registerAdmin = async (request) => {
  // TODO validasi request
  const registerAdminRequest = validate(registerAdminSchemaRequest, request);

  try {
    // TODO cek password dan confirm password
    if (registerAdminRequest.password !== registerAdminRequest.confirmPassword)
      throw new ResponseError(
        400,
        "Password and confirm password must be same"
      );

    // TODO cek apakah username sudah terdaftar
    const adminExist = await prisma.admin.findUnique({
      where: { username: registerAdminRequest.username },
    });

    // TODO throw error jika username sudah terdaftar
    if (adminExist) throw new ResponseError(400, "Username already exist");

    // TODO hash password
    const hashedPassword = await bcrypt.hash(registerAdminRequest.password, 10);

    // TODO buat admin
    const newAdmin = await prisma.admin.create({
      data: {
        pin: registerAdminRequest.pin,
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

// TODO login admin
const loginAdmin = async (request) => {
  // TODO validasi request
  const loginAdminRequest = validate(loginAdminSchemaRequest, request);

  try {
    // TODO cek admin
    const admin = await prisma.admin.findUnique({
      where: { pin: loginAdminRequest.id },
    });

    // TODO cek apakah admin sudah terdaftar throw error
    if (!admin)
      throw new ResponseError(
        404,
        `Admin with username ${loginAdminRequest.id} not found`
      );

    // TODO cek password
    const isPasswordMatch = await bcrypt.compare(
      loginAdminRequest.password,
      admin.password
    );

    // TODO throw error jika password salah
    if (!isPasswordMatch) throw new ResponseError(400, "Password is incorrect");

    // TODO cek apakah refresh token sudah expired (untuk user lama)
    if (admin.refreshToken) {
      try {
        jwt.verify(admin.refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        // TODO jika refresh token sudah expired
        if (error.name === "TokenExpiredError") {
          // TODO update refresh token
          await prisma.admin.update({
            data: { refreshToken: null, updatedAt: new Date() },
            where: { pin: admin.pin },
          });
        }
      }
    }

    // TODO buat access token
    const accessToken = jwt.sign(
      { id: admin.pin, nama: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
        subject: admin.username,
      }
    );

    // TODO buat refresh token
    const refreshToken = jwt.sign(
      { id: admin.pin, nama: admin.username, role: "admin" },
      process.env.JWT_REFRESH_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        subject: admin.username,
      }
    );

    // TODO update admin
    await prisma.admin.update({
      data: { refreshToken: refreshToken, updatedAt: new Date() },
      where: { pin: admin.pin },
    });

    return {
      pin: admin.pin,
      username: admin.username,
      role: "admin",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO register dosen
const registerDosen = async (request) => {
  // TODO validasi request
  const registerDosenRequest = validate(registerDosenSchemaRequest, request);

  try {
    // TOD cek prodi apakah ada
    const prodi = await prodiService.findProdiByName(
      registerDosenRequest.namaProdi
    );

    // TODO cek password dan confirm password
    if (registerDosenRequest.password !== registerDosenRequest.confirmPassword)
      throw new ResponseError(
        400,
        "Password and confirm password must be same"
      );

    // TODO cek apakah nip sudah terdaftar
    const dosenExist = await prisma.dosen.findUnique({
      where: { nip: registerDosenRequest.nip, prodiId: prodi.id },
    });

    // TODO throw error jika nip sudah terdaftar
    if (dosenExist) throw new ResponseError(400, "Dosen already exist");

    // TODO hash password
    const hashedPassword = await bcrypt.hash(registerDosenRequest.password, 10);

    // TODO buat dosen
    const newDosen = await prisma.dosen.create({
      data: {
        nip: registerDosenRequest.nip,
        nama: registerDosenRequest.nama,
        prodiId: prodi.id,
        email: registerDosenRequest.email,
        password: hashedPassword,
        alamat: registerDosenRequest.alamat,
        createdAt: new Date(),
      },
      include: { prodi: true },
    });

    return registerDosenResponse(newDosen);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO login dosen
const loginDosen = async (request) => {
  // TODO validasi request
  const loginDosenRequest = validate(loginDosenSchemaRequest, request);

  try {
    // TODO cek dosen
    const dosen = await prisma.dosen.findUnique({
      where: { nip: loginDosenRequest.id },
      include: { prodi: true },
    });

    // TODO cek apakah dosen sudah terdaftar throw error
    if (!dosen)
      throw new ResponseError(
        404,
        `Dosen with NIP ${loginDosenRequest.id} not found`
      );

    // TODO cek password
    const isPasswordValid = await bcrypt.compare(
      loginDosenRequest.password,
      dosen.password
    );

    // TODO throw error jika password salah
    if (!isPasswordValid) throw new ResponseError(400, "Password is incorrect");

    // TODO cek apakah refresh token sudah expired (untuk user lama)
    if (dosen.refreshToken) {
      try {
        jwt.verify(dosen.refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        // TODO jika refresh token sudah expired
        if (error.name === "TokenExpiredError") {
          // TODO update refresh token
          await prisma.dosen.update({
            data: { refreshToken: null, updatedAt: new Date() },
            where: { nip: dosen.nip },
          });
        }
      }
    }

    // TODO buat access token
    const accessToken = jwt.sign(
      { id: dosen.nip, nama: dosen.nama, role: "dosen" },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
        subject: dosen.email,
      }
    );

    // TODO buat refresh token
    const refreshToken = jwt.sign(
      { id: dosen.nip, nama: dosen.nama, role: "dosen" },
      process.env.JWT_REFRESH_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        subject: dosen.email,
      }
    );

    // TODO update dosen
    await prisma.dosen.update({
      data: { refreshToken: refreshToken, updatedAt: new Date() },
      where: { nip: dosen.nip },
    });

    return {
      nip: dosen.nip,
      nama: dosen.nama,
      role: "dosen",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO register mahasiswa
const registerMahasiswa = async (request) => {
  const registerMahasiswaRequest = validate(
    registerMahasiswaSchemaRequest,
    request
  );

  try {
    // TODO cek prodi apakah ada
    const prodi = await prodiService.findProdiByName(
      registerMahasiswaRequest.namaProdi
    );

    // TODO cek password dan confirm password
    if (
      registerMahasiswaRequest.password !==
      registerMahasiswaRequest.confirmPassword
    )
      throw new ResponseError(
        400,
        "Password and confirm password must be same"
      );

    // TODO cek apakah nim sudah terdaftar
    const mahasiswaExist = await prisma.mahasiswa.findUnique({
      where: { nim: registerMahasiswaRequest.nim, prodiId: prodi.id },
    });

    // TODO throw error jika nim sudah terdaftar
    if (mahasiswaExist) throw new ResponseError(400, "Mahasiswa already exist");

    // TODO hash password
    const hashedPassword = await bcrypt.hash(
      registerMahasiswaRequest.password,
      10
    );

    // TODO buat mahasiswa
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
      include: { prodi: true },
    });

    return registerMahasiswaResponse(newMahasiswa);
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO login mahasiswa
const loginMahasiswa = async (request) => {
  // TODO validasi request
  const loginMahasiswaRequest = validate(loginMahasiswaSchemaRequest, request);

  try {
    // TODO cek mahasiswa
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim: loginMahasiswaRequest.id },
      include: { prodi: true },
    });

    // TODO cek apakah mahasiswa sudah terdaftar throw error
    if (!mahasiswa)
      throw new ResponseError(
        404,
        `Mahasiswa with NIM ${loginMahasiswaRequest.id} not found`
      );

    // TODO verify password
    const isPasswordValid = await bcrypt.compare(
      loginMahasiswaRequest.password,
      mahasiswa.password
    );

    if (!isPasswordValid) throw new ResponseError(401, "Invalid password");

    // TODO cek apakah refresh token sudah expired (untuk user lama)
    if (mahasiswa.refreshToken) {
      try {
        jwt.verify(mahasiswa.refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        // TODO jika refresh token sudah expired
        if (error.name === "TokenExpiredError") {
          // TODO update refresh token
          await prisma.mahasiswa.update({
            data: { refreshToken: null, updatedAt: new Date() },
            where: { nim: mahasiswa.nim },
          });
        }
      }
    }

    // TODO buat token
    const accessToken = jwt.sign(
      { id: mahasiswa.nim, nama: mahasiswa.nama, role: "mahasiswa" },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
        subject: mahasiswa.email,
      }
    );

    // TODO buat refresh token
    const refreshToken = jwt.sign(
      { id: mahasiswa.nim, nama: mahasiswa.nama, role: "mahasiswa" },
      process.env.JWT_REFRESH_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        subject: mahasiswa.email,
      }
    );

    // TODO update mahasiswa
    await prisma.mahasiswa.update({
      data: { refreshToken: refreshToken, updatedAt: new Date() },
      where: { nim: mahasiswa.nim },
    });

    return {
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      role: "mahasiswa",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO refresh token
const refreshToken = async (request) => {
  try {
    // TODO decode refresh token
    const decode = jwt.verify(request, process.env.JWT_REFRESH_SECRET);

    // TODO inisialisasi variable access token
    let accessToken;

    /** TODO cek apakah token ini rolenya admin/dosen/mahasiswa?,
     jika iya, maka access token untuk admin
     jika dosen maka access token untuk dosen
     jika admin maka access token untuk mahasiswa
     */
    if (decode.role === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { pin: decode.id },
      });

      if (!admin)
        throw new ResponseError(
          404,
          `Admin with username ${decode.username} not found`
        );

      // TODO cek apakah refresh token sama dengan refresh token di database
      if (admin.refreshToken !== request)
        throw new ResponseError(400, "Invalid refresh token");

      accessToken = jwt.sign(
        { id: decode.id, nama: decode.nama, role: "admin" },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: process.env.JWT_EXPIRES_IN,
          subject: decode.nama,
        }
      );
    }

    if (decode.role === "dosen") {
      const dosen = await prisma.dosen.findUnique({
        where: { nip: decode.nip },
      });

      if (!dosen)
        throw new ResponseError(404, `Dosen with NIP ${decode.nip} not found`);

      // TODO cek apakah refresh token sama dengan refresh token di database
      if (dosen.refreshToken !== request)
        throw new ResponseError(400, "Invalid refresh token");

      accessToken = jwt.sign(
        { nip: decode.nip, nama: decode.nama, role: "dosen" },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: process.env.JWT_EXPIRES_IN,
          subject: dosen.email,
        }
      );
    }

    if (decode.role === "mahasiswa") {
      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: { nim: decode.nim },
      });

      if (!mahasiswa)
        throw new ResponseError(
          404,
          `Mahasiswa with NIM ${decode.nim} not found`
        );

      // TODO cek apakah refresh token sama dengan refresh token di database
      if (mahasiswa.refreshToken !== request)
        throw new ResponseError(400, "Invalid refresh token");

      accessToken = jwt.sign(
        { nim: decode.nim, nama: decode.nama, role: "mahasiswa" },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: process.env.JWT_EXPIRES_IN,
          subject: mahasiswa.email,
        }
      );
    }

    return { accessToken: accessToken };
  } catch (error) {
    // Handle JWT Expired Error
    if (error.name === "TokenExpiredError") {
      // Decode token tanpa verifikasi untuk mendapatkan payload (karena token sudah expired)
      const expiredDecode = jwt.decode(request);

      console.log("expiredDecode", expiredDecode);

      // Update refreshToken di database berdasarkan role
      if (expiredDecode.role === "admin") {
        await prisma.admin.updateMany({
          where: { username: expiredDecode.username },
          data: { refreshToken: null },
        });
      } else if (expiredDecode.role === "dosen") {
        await prisma.dosen.updateMany({
          where: { nip: expiredDecode.nip },
          data: { refreshToken: null },
        });
      } else if (expiredDecode.role === "mahasiswa") {
        await prisma.mahasiswa.updateMany({
          where: { nim: expiredDecode.nim },
          data: { refreshToken: null },
        });
      }

      throw new ResponseError(401, "Refresh token expired, please login again");
    }

    throw new ResponseError(error.status, error.message);
  }
};

// TODO logout
const logout = async (accessToken) => {
  try {
    // TODO cek apakah refresh token ada di cookie?
    if (!accessToken || typeof accessToken !== "string")
      throw new ResponseError(400, "Access token must be a string");

    // TODO Decode token untuk mendapatkan payload token (tanpa verifikasi expiry)
    const decoded = jwt.decode(accessToken);
    if (!decoded || typeof decoded !== "object")
      throw new ResponseError(400, "Invalid access token");

    // TODO Cek validitas token (abaikan jika expired)
    try {
      jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (verifyError) {
      if (verifyError.name !== "TokenExpiredError") {
        throw new ResponseError(401, "Invalid access token");
      }
    }

    // TODO Hapus refresh token berdasarkan role
    let updateResult;
    const { role } = decoded;

    if (role === "admin") {
      updateResult = await prisma.admin.updateMany({
        where: { username: decoded.username },
        data: { refreshToken: null, updatedAt: new Date() },
      });
    } else if (role === "dosen") {
      updateResult = await prisma.dosen.updateMany({
        where: { nip: decoded.nip },
        data: { refreshToken: null, updatedAt: new Date() },
      });
    } else if (role === "mahasiswa") {
      updateResult = await prisma.mahasiswa.updateMany({
        where: { nim: decoded.nim },
        data: { refreshToken: null, updatedAt: new Date() },
      });
    } else {
      throw new ResponseError(400, "Invalid user role");
    }

    // TODO Cek apakah data berhasil diupdate
    if (updateResult.count === 0) {
      throw new ResponseError(404, "User not found or token mismatch");
    }

    return;
  } catch (error) {
    console.error("Logout error:", error);
    throw new ResponseError(
      error.status || 500,
      error.message || "Logout failed"
    );
  }
};

export default {
  registerAdmin,
  loginAdmin,
  registerDosen,
  loginDosen,
  registerMahasiswa,
  loginMahasiswa,
  refreshToken,
  logout,
};
