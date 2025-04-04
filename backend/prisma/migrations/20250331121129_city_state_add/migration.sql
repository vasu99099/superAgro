-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Village` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `population` INTEGER NULL,
    `area_sq_km` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Village` ADD CONSTRAINT `Village_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `City`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
