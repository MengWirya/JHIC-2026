ALTER TABLE `Konten` ADD COLUMN `slug` VARCHAR(191) NULL;

UPDATE `Konten`
SET `slug` = CONCAT('konten-', `id`)
WHERE `slug` IS NULL;

ALTER TABLE `Konten` MODIFY `slug` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `Konten_slug_key` ON `Konten`(`slug`);
