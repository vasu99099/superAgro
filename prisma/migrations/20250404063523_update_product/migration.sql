/*
  Warnings:

  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packing` on the `Product` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_village_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Village` DROP FOREIGN KEY `Village_city_id_fkey`;

-- DropIndex
DROP INDEX `Customer_village_id_fkey` ON `Customer`;

-- DropIndex
DROP INDEX `Product_category_id_key` ON `Product`;

-- DropIndex
DROP INDEX `Village_city_id_fkey` ON `Village`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `category_id`,
    DROP COLUMN `packing`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ProductPackaging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `packagingType` ENUM('mg', 'g', 'kg', 'ml', 'l') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `altText` VARCHAR(255) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Village` ADD CONSTRAINT `Village_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPackaging` ADD CONSTRAINT `ProductPackaging_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
