-- DropForeignKey
ALTER TABLE `ProductImage` DROP FOREIGN KEY `ProductImage_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductPackaging` DROP FOREIGN KEY `ProductPackaging_productId_fkey`;

-- DropIndex
DROP INDEX `ProductImage_productId_fkey` ON `ProductImage`;

-- DropIndex
DROP INDEX `ProductPackaging_productId_fkey` ON `ProductPackaging`;

-- AddForeignKey
ALTER TABLE `ProductPackaging` ADD CONSTRAINT `ProductPackaging_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
