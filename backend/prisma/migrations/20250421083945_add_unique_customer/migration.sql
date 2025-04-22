/*
  Warnings:

  - A unique constraint covering the columns `[user_id,phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Customer_user_id_phone_key` ON `Customer`(`user_id`, `phone`);
