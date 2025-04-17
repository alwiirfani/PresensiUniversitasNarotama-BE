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
      where: {
        username: registerAdminRequest.username,
      },
    });

    // TODO throw error jika username sudah terdaftar
    if (adminExist) throw new ResponseError(400, "Username already exist");

    // TODO hash password
    const hashedPassword = await bcrypt.hash(registerAdminRequest.password, 10);

    // TODO buat admin
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

// TODO login admin
const loginAdmin = async (request) => {
  // TODO validasi request
  const loginAdminRequest = validate(loginAdminSchemaRequest, request);

  try {
    // TODO cek admin
    const admin = await prisma.admin.findUnique({
      where: {
        username: loginAdminRequest.username,
      },
    });

    // TODO cek apakah admin sudah terdaftar throw error
    if (!admin)
      throw new ResponseError(
        404,
        `Admin with username ${loginAdminRequest.username} not found`
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
            data: {
              refreshToken: null,
              updatedAt: new Date(),
            },
            where: {
              id: admin.id,
            },
          });
        }
      }
    }

    // TODO cek apakah refresh token sudah expired (untuk user lama)
    if (admin.refreshToken) {
      try {
        jwt.verify(admin.refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        // TODO jika refresh token sudah expired
        if (error.name === "TokenExpiredError") {
          // TODO update refresh token
          await prisma.admin.update({
            data: {
              refreshToken: null,
              updatedAt: new Date(),
            },
            where: {
              id: admin.id,
            },
          });
        }
      }
    }

    // TODO buat access token
    const accessToken = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1m",
        subject: admin.username,
      }
    );

    // TODO buat refresh token
    const refreshToken = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      process.env.JWT_REFRESH_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1d",
        subject: admin.username,
      }
    );

    // TODO update admin
    await prisma.admin.update({
      data: {
        refreshToken: refreshToken,
        updatedAt: new Date(),
      },
      where: {
        id: admin.id,
      },
    });

    return {
      id: admin.id,
      username: admin.username,
      role: "admin",
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
      where: {
        nim: registerMahasiswaRequest.nim,
        prodiId: prodi.id,
      },
    });

    // TODO throw error jika nim sudah terdaftar
    if (mahasiswaExist) throw new ResponseError(400, "NIM already exist");

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
      include: {
        prodi: true,
      },
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
      where: {
        nim: loginMahasiswaRequest.nim,
      },
      include: {
        prodi: true,
      },
    });

    // TODO cek apakah mahasiswa sudah terdaftar throw error
    if (!mahasiswa)
      throw new ResponseError(
        404,
        `Mahasiswa with NIM ${loginMahasiswaRequest.nim} not found`
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
            data: {
              refreshToken: null,
              updatedAt: new Date(),
            },
            where: {
              nim: mahasiswa.nim,
            },
          });
        }
      }
    }

    // TODO buat token
    const accessToken = jwt.sign(
      {
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        role: "mahasiswa",
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1s",
        subject: mahasiswa.email,
      }
    );

    // TODO buat refresh token
    const refreshToken = jwt.sign(
      {
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        role: "mahasiswa",
      },
      process.env.JWT_REFRESH_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1d",
        subject: mahasiswa.email,
      }
    );

    // TODO update mahasiswa
    await prisma.mahasiswa.update({
      data: {
        refreshToken: refreshToken,
        updatedAt: new Date(),
      },
      where: {
        nim: mahasiswa.nim,
      },
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
        where: {
          username: decode.username,
        },
      });

      if (!admin)
        throw new ResponseError(
          404,
          `Admin with username ${decode.username} not found`
        );

      accessToken = jwt.sign(
        {
          id: decode.id,
          username: decode.username,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "1d",
          subject: decode.username,
        }
      );
    }

    if (decode.role === "dosen") {
      const dosen = await prisma.dosen.findFirst({
        where: {
          nip: decode.nip,
        },
      });

      if (!dosen)
        throw new ResponseError(404, `Dosen with NIP ${decode.nip} not found`);

      accessToken = jwt.sign(
        {
          nip: decode.nip,
          namae: decode.nama,
          role: "dosen",
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "1d",
          subject: dosen.email,
        }
      );
    }

    if (decode.role === "mahasiswa") {
      const mahasiswa = await prisma.mahasiswa.findFirst({
        where: {
          nim: decode.nim,
        },
      });

      if (!mahasiswa)
        throw new ResponseError(
          404,
          `Mahasiswa with NIM ${decode.nim} not found`
        );

      accessToken = jwt.sign(
        {
          nim: decode.nim,
          nama: decode.nama,
          role: "mahasiswa",
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "1d",
          subject: mahasiswa.email,
        }
      );
    }

    return {
      accessToken: accessToken,
    };
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

// TODO logout
const logout = async (refreshToken) => {
  try {
    // TODO cek apakah refresh token ada?
    if (!refreshToken)
      throw new ResponseError(204, "no content of refresh token");

    // TODO decode refresh token
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    /** TODO cek apakah token ini rolenya admin/dosen/mahasiswa?,
     jika iya, maka hapus refresh token untuk table admin
     jika dosen maka hapus refresh token untuk table dosen
     jika admin maka hapus refresh token untuk table mahasiswa
     */
    if (decode.role === "admin") {
      // TODO cek admin ada atau tidak
      const admin = await prisma.admin.findFirst({
        where: {
          refreshToken: refreshToken,
        },
      });

      // TODO throw error jika admin tidak ada
      if (!admin) throw new ResponseError(404, "Admin not found");

      // TODO hapus refresh token
      await prisma.admin.update({
        data: {
          refreshToken: null,
          updatedAt: new Date(),
        },
        where: {
          username: decode.username,
        },
      });
    }

    if (decode.role === "dosen") {
      // TODO cek dosen ada atau tidak
      const dosen = await prisma.dosen.findFirst({
        where: {
          refreshToken: refreshToken,
        },
      });

      // TODO throw error jika dosen tidak ada
      if (!dosen) throw new ResponseError(404, "Dosen not found");

      // TODO hapus refresh token
      await prisma.dosen.update({
        data: {
          refreshToken: null,
          updatedAt: new Date(),
        },
        where: {
          nip: decode.nip,
        },
      });
    }

    if (decode.role === "mahasiswa") {
      // TODO cek mahasiwa ada atau tidak
      const mahasiswa = await prisma.mahasiswa.findFirst({
        where: {
          refreshToken: refreshToken,
        },
      });

      // TODO throw error jika mahasiswa tidak ada
      if (!mahasiswa)
        throw new ResponseError(
          404,
          `Mahasiswa with NIM ${decode.nim} not found`
        );

      // TODO hapus refresh token
      await prisma.mahasiswa.update({
        data: {
          refreshToken: null,
          updatedAt: new Date(),
        },
        where: {
          nim: decode.nim,
        },
      });
    }

    return;
  } catch (error) {
    throw new ResponseError(error.status, error.message);
  }
};

export default {
  registerAdmin,
  loginAdmin,
  registerMahasiswa,
  loginMahasiswa,
  refreshToken,
  logout,
};
