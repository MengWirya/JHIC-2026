CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'SUPER_ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Konten` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe` ENUM('PRESTASI', 'BERITA', 'BLUD', 'GALERI') NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `gambarUrl` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `adminId` INTEGER NOT NULL,
    UNIQUE INDEX `Konten_slug_key`(`slug`),
    INDEX `Konten_tipe_status_idx`(`tipe`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Perusahaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `overview` TEXT NOT NULL,
    `kontak` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `adminId` INTEGER NOT NULL,
    UNIQUE INDEX `Perusahaan_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Lowongan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `judulPosisi` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `tipe` ENUM('PKL', 'MAGANG', 'FULL_TIME') NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `syaratKeahlian` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'CLOSED') NOT NULL DEFAULT 'PUBLISHED',
    `perusahaanId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Lowongan_slug_key`(`slug`),
    INDEX `Lowongan_tipe_status_idx`(`tipe`, `status`),
    INDEX `Lowongan_perusahaanId_idx`(`perusahaanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Lamaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `kelasAlumni` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `portfolioUrl` VARCHAR(191) NOT NULL,
    `pesanTambahan` TEXT NULL,
    `status` ENUM('BARU', 'DITINJAU', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'BARU',
    `lowonganId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `Lamaran_lowonganId_status_idx`(`lowonganId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TagJurusan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `TagJurusan_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `PerusahaanTag` (
    `perusahaanId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,
    PRIMARY KEY (`perusahaanId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Testimoni` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaPemberi` VARCHAR(191) NOT NULL,
    `peran` VARCHAR(191) NOT NULL,
    `fotoUrl` VARCHAR(191) NULL,
    `kutipan` TEXT NOT NULL,
    `perusahaanId` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Faq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategori` VARCHAR(191) NOT NULL,
    `pertanyaan` TEXT NOT NULL,
    `jawaban` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ChatLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pertanyaan` TEXT NOT NULL,
    `jawaban` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `PesanMasuk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telp` VARCHAR(191) NULL,
    `subjek` VARCHAR(191) NOT NULL,
    `pesan` TEXT NOT NULL,
    `status` ENUM('BARU', 'DIPROSES', 'SELESAI') NOT NULL DEFAULT 'BARU',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Konten` ADD CONSTRAINT `Konten_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Perusahaan` ADD CONSTRAINT `Perusahaan_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Lowongan` ADD CONSTRAINT `Lowongan_perusahaanId_fkey` FOREIGN KEY (`perusahaanId`) REFERENCES `Perusahaan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Lowongan` ADD CONSTRAINT `Lowongan_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Lamaran` ADD CONSTRAINT `Lamaran_lowonganId_fkey` FOREIGN KEY (`lowonganId`) REFERENCES `Lowongan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `PerusahaanTag` ADD CONSTRAINT `PerusahaanTag_perusahaanId_fkey` FOREIGN KEY (`perusahaanId`) REFERENCES `Perusahaan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `PerusahaanTag` ADD CONSTRAINT `PerusahaanTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `TagJurusan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Testimoni` ADD CONSTRAINT `Testimoni_perusahaanId_fkey` FOREIGN KEY (`perusahaanId`) REFERENCES `Perusahaan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
