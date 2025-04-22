-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_village_id_fkey`;

-- DropForeignKey
ALTER TABLE `Dosage` DROP FOREIGN KEY `Dosage_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `Dosage` DROP FOREIGN KEY `Dosage_farm_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_userId_fkey`;

-- DropForeignKey
ALTER TABLE `farms` DROP FOREIGN KEY `farms_village_id_fkey`;

-- DropIndex
DROP INDEX `Customer_village_id_fkey` ON `Customer`;

-- DropIndex
DROP INDEX `Dosage_customer_id_fkey` ON `Dosage`;

-- DropIndex
DROP INDEX `Dosage_farm_id_fkey` ON `Dosage`;

-- DropIndex
DROP INDEX `Product_userId_fkey` ON `Product`;

-- DropIndex
DROP INDEX `farms_village_id_fkey` ON `farms`;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farms` ADD CONSTRAINT `farms_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dosage` ADD CONSTRAINT `Dosage_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `farms`(`farm_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dosage` ADD CONSTRAINT `Dosage_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
