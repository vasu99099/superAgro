/*
  Warnings:

  - A unique constraint covering the columns `[name,user_id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Category_name_user_id_key` ON `Category`(`name`, `user_id`);
