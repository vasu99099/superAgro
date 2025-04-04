-- CreateTable
CREATE TABLE `Customer` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NULL,
    `village_id` INTEGER NOT NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `phone` VARCHAR(20) NOT NULL,
    `whatsapp_number` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `Village`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
