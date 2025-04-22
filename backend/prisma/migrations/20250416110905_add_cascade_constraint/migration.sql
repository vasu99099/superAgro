-- DropForeignKey
ALTER TABLE `SuggestedPesticide` DROP FOREIGN KEY `SuggestedPesticide_dosage_id_fkey`;

-- DropForeignKey
ALTER TABLE `SuggestedPesticide` DROP FOREIGN KEY `SuggestedPesticide_product_id_fkey`;

-- DropIndex
DROP INDEX `SuggestedPesticide_dosage_id_fkey` ON `SuggestedPesticide`;

-- DropIndex
DROP INDEX `SuggestedPesticide_product_id_fkey` ON `SuggestedPesticide`;

-- AddForeignKey
ALTER TABLE `SuggestedPesticide` ADD CONSTRAINT `SuggestedPesticide_dosage_id_fkey` FOREIGN KEY (`dosage_id`) REFERENCES `Dosage`(`dosage_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuggestedPesticide` ADD CONSTRAINT `SuggestedPesticide_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
