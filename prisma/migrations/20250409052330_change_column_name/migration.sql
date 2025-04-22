/*
  Warnings:

  - You are about to drop the column `quantity` on the `ProductPackaging` table. All the data in the column will be lost.
  - Added the required column `packSize` to the `ProductPackaging` table without a default value. This is not possible if the table is not empty.
  - Made the column `packagingType` on table `ProductPackaging` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ProductPackaging` DROP COLUMN `quantity`,
    ADD COLUMN `packSize` DOUBLE NOT NULL,
    MODIFY `packagingType` ENUM('mg', 'g', 'kg', 'ml', 'l') NOT NULL;
