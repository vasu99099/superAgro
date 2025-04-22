-- CreateTable
CREATE TABLE `Dosage` (
    `dosage_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `isClosed` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`dosage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuggestedPesticide` (
    `suggested_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,
    `dosage_id` INTEGER NOT NULL,

    PRIMARY KEY (`suggested_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dosage` ADD CONSTRAINT `Dosage_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `farms`(`farm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuggestedPesticide` ADD CONSTRAINT `SuggestedPesticide_dosage_id_fkey` FOREIGN KEY (`dosage_id`) REFERENCES `Dosage`(`dosage_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuggestedPesticide` ADD CONSTRAINT `SuggestedPesticide_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
