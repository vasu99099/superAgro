/*
  Warnings:

  - Added the required column `customer_id` to the `Dosage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Dosage` ADD COLUMN `customer_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Dosage` ADD CONSTRAINT `Dosage_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
