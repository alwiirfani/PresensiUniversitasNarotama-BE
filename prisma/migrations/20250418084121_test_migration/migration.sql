-- CreateEnum
CREATE TYPE "StatusPresensi" AS ENUM ('HADIR', 'IZIN', 'ALPHA');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('SUCCESS', 'FAILED_EXPIRED', 'FAILED_INVALID');

-- CreateTable
CREATE TABLE "Fakultas" (
    "id" VARCHAR(255) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "dekan" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fakultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prodi" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "kode" CHAR(3) NOT NULL,
    "fakultasId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "nim" CHAR(8) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "refreshToken" TEXT,
    "prodiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("nim")
);

-- CreateTable
CREATE TABLE "Dosen" (
    "nip" CHAR(5) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "refreshToken" TEXT,
    "prodiId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dosen_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "MataKuliah" (
    "kode" CHAR(5) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "sks" INTEGER NOT NULL,
    "prodiId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MataKuliah_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "Presensi" (
    "id" VARCHAR(255) NOT NULL,
    "mahasiswaNim" CHAR(7) NOT NULL,
    "jadwalMataKuliahId" VARCHAR(255) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "scanTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusPresensi" NOT NULL,
    "qrTokenUsed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedByDosenNip" TEXT,

    CONSTRAINT "Presensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalMataKuliah" (
    "id" VARCHAR(255) NOT NULL,
    "hari" VARCHAR(10) NOT NULL,
    "jamMulai" VARCHAR(50) NOT NULL,
    "jamSelesai" VARCHAR(50) NOT NULL,
    "ruangan" VARCHAR(10) NOT NULL,
    "mataKuliahKode" CHAR(5) NOT NULL,
    "dosenNip" CHAR(7) NOT NULL,
    "qrCodeToken" VARCHAR(255),
    "qrCodeExpiredAt" TIMESTAMP(3),
    "qrCodeUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JadwalMataKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MahasiswaJadwal" (
    "id" VARCHAR(255) NOT NULL,
    "mahasiswaNim" CHAR(7) NOT NULL,
    "jadwalMataKuliahId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MahasiswaJadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DosenMahasiswa" (
    "id" VARCHAR(255) NOT NULL,
    "dosenNip" CHAR(7) NOT NULL,
    "mahasiswaNim" CHAR(7) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DosenMahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MahasiswaMataKuliah" (
    "id" VARCHAR(255) NOT NULL,
    "mahasiswaNim" CHAR(7) NOT NULL,
    "mataKuliahKode" CHAR(5) NOT NULL,
    "semester" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MahasiswaMataKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DosenMataKuliah" (
    "id" VARCHAR(255) NOT NULL,
    "dosenNip" CHAR(7) NOT NULL,
    "mataKuliahKode" CHAR(5) NOT NULL,
    "tahunAjaran" VARCHAR(255),
    "semester" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DosenMataKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanLog" (
    "id" TEXT NOT NULL,
    "mahasiswaNim" CHAR(7),
    "jadwalMataKuliahId" TEXT,
    "scannedByDosenNip" TEXT,
    "qrToken" VARCHAR(255) NOT NULL,
    "scanTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ScanStatus" NOT NULL,
    "errorMessage" VARCHAR(255),

    CONSTRAINT "ScanLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MahasiswaQRCode" (
    "id" TEXT NOT NULL,
    "mahasiswaNim" TEXT NOT NULL,
    "jadwalMataKuliahId" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "MahasiswaQRCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Fakultas_nama_idx" ON "Fakultas"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Prodi_kode_key" ON "Prodi"("kode");

-- CreateIndex
CREATE INDEX "Prodi_nama_kode_idx" ON "Prodi"("nama", "kode");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_email_key" ON "Mahasiswa"("email");

-- CreateIndex
CREATE INDEX "Mahasiswa_nim_email_idx" ON "Mahasiswa"("nim", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_prodiId_key" ON "Mahasiswa"("prodiId");

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_email_key" ON "Dosen"("email");

-- CreateIndex
CREATE INDEX "Dosen_nip_email_idx" ON "Dosen"("nip", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_prodiId_key" ON "Dosen"("prodiId");

-- CreateIndex
CREATE INDEX "MataKuliah_kode_nama_idx" ON "MataKuliah"("kode", "nama");

-- CreateIndex
CREATE INDEX "Presensi_mahasiswaNim_jadwalMataKuliahId_idx" ON "Presensi"("mahasiswaNim", "jadwalMataKuliahId");

-- CreateIndex
CREATE UNIQUE INDEX "Presensi_mahasiswaNim_jadwalMataKuliahId_tanggal_key" ON "Presensi"("mahasiswaNim", "jadwalMataKuliahId", "tanggal");

-- CreateIndex
CREATE INDEX "JadwalMataKuliah_mataKuliahKode_dosenNip_hari_idx" ON "JadwalMataKuliah"("mataKuliahKode", "dosenNip", "hari");

-- CreateIndex
CREATE UNIQUE INDEX "JadwalMataKuliah_mataKuliahKode_hari_jamMulai_ruangan_key" ON "JadwalMataKuliah"("mataKuliahKode", "hari", "jamMulai", "ruangan");

-- CreateIndex
CREATE INDEX "MahasiswaJadwal_mahasiswaNim_jadwalMataKuliahId_idx" ON "MahasiswaJadwal"("mahasiswaNim", "jadwalMataKuliahId");

-- CreateIndex
CREATE UNIQUE INDEX "MahasiswaJadwal_mahasiswaNim_jadwalMataKuliahId_key" ON "MahasiswaJadwal"("mahasiswaNim", "jadwalMataKuliahId");

-- CreateIndex
CREATE INDEX "DosenMahasiswa_dosenNip_mahasiswaNim_idx" ON "DosenMahasiswa"("dosenNip", "mahasiswaNim");

-- CreateIndex
CREATE UNIQUE INDEX "DosenMahasiswa_dosenNip_mahasiswaNim_key" ON "DosenMahasiswa"("dosenNip", "mahasiswaNim");

-- CreateIndex
CREATE INDEX "MahasiswaMataKuliah_mahasiswaNim_mataKuliahKode_idx" ON "MahasiswaMataKuliah"("mahasiswaNim", "mataKuliahKode");

-- CreateIndex
CREATE UNIQUE INDEX "MahasiswaMataKuliah_mahasiswaNim_mataKuliahKode_key" ON "MahasiswaMataKuliah"("mahasiswaNim", "mataKuliahKode");

-- CreateIndex
CREATE INDEX "DosenMataKuliah_dosenNip_mataKuliahKode_idx" ON "DosenMataKuliah"("dosenNip", "mataKuliahKode");

-- CreateIndex
CREATE UNIQUE INDEX "DosenMataKuliah_dosenNip_mataKuliahKode_key" ON "DosenMataKuliah"("dosenNip", "mataKuliahKode");

-- CreateIndex
CREATE INDEX "ScanLog_mahasiswaNim_jadwalMataKuliahId_scanTime_idx" ON "ScanLog"("mahasiswaNim", "jadwalMataKuliahId", "scanTime");

-- CreateIndex
CREATE UNIQUE INDEX "ScanLog_jadwalMataKuliahId_key" ON "ScanLog"("jadwalMataKuliahId");

-- CreateIndex
CREATE INDEX "MahasiswaQRCode_mahasiswaNim_jadwalMataKuliahId_createdAt_idx" ON "MahasiswaQRCode"("mahasiswaNim", "jadwalMataKuliahId", "createdAt");

-- AddForeignKey
ALTER TABLE "Prodi" ADD CONSTRAINT "Prodi_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "Fakultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dosen" ADD CONSTRAINT "Dosen_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MataKuliah" ADD CONSTRAINT "MataKuliah_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_mahasiswaNim_fkey" FOREIGN KEY ("mahasiswaNim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_jadwalMataKuliahId_fkey" FOREIGN KEY ("jadwalMataKuliahId") REFERENCES "JadwalMataKuliah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_verifiedByDosenNip_fkey" FOREIGN KEY ("verifiedByDosenNip") REFERENCES "Dosen"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalMataKuliah" ADD CONSTRAINT "JadwalMataKuliah_mataKuliahKode_fkey" FOREIGN KEY ("mataKuliahKode") REFERENCES "MataKuliah"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalMataKuliah" ADD CONSTRAINT "JadwalMataKuliah_dosenNip_fkey" FOREIGN KEY ("dosenNip") REFERENCES "Dosen"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MahasiswaJadwal" ADD CONSTRAINT "MahasiswaJadwal_mahasiswaNim_fkey" FOREIGN KEY ("mahasiswaNim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MahasiswaJadwal" ADD CONSTRAINT "MahasiswaJadwal_jadwalMataKuliahId_fkey" FOREIGN KEY ("jadwalMataKuliahId") REFERENCES "JadwalMataKuliah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DosenMahasiswa" ADD CONSTRAINT "DosenMahasiswa_dosenNip_fkey" FOREIGN KEY ("dosenNip") REFERENCES "Dosen"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DosenMahasiswa" ADD CONSTRAINT "DosenMahasiswa_mahasiswaNim_fkey" FOREIGN KEY ("mahasiswaNim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MahasiswaMataKuliah" ADD CONSTRAINT "MahasiswaMataKuliah_mahasiswaNim_fkey" FOREIGN KEY ("mahasiswaNim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MahasiswaMataKuliah" ADD CONSTRAINT "MahasiswaMataKuliah_mataKuliahKode_fkey" FOREIGN KEY ("mataKuliahKode") REFERENCES "MataKuliah"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DosenMataKuliah" ADD CONSTRAINT "DosenMataKuliah_dosenNip_fkey" FOREIGN KEY ("dosenNip") REFERENCES "Dosen"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DosenMataKuliah" ADD CONSTRAINT "DosenMataKuliah_mataKuliahKode_fkey" FOREIGN KEY ("mataKuliahKode") REFERENCES "MataKuliah"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanLog" ADD CONSTRAINT "ScanLog_jadwalMataKuliahId_fkey" FOREIGN KEY ("jadwalMataKuliahId") REFERENCES "JadwalMataKuliah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanLog" ADD CONSTRAINT "ScanLog_scannedByDosenNip_fkey" FOREIGN KEY ("scannedByDosenNip") REFERENCES "Dosen"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MahasiswaQRCode" ADD CONSTRAINT "MahasiswaQRCode_mahasiswaNim_fkey" FOREIGN KEY ("mahasiswaNim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MahasiswaQRCode" ADD CONSTRAINT "MahasiswaQRCode_jadwalMataKuliahId_fkey" FOREIGN KEY ("jadwalMataKuliahId") REFERENCES "JadwalMataKuliah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
