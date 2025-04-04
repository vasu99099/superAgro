/*
  Warnings:

  - You are about to drop the column `latitude` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `farms` (
    `farm_id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_name` VARCHAR(255) NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `village_id` INTEGER NOT NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`farm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
