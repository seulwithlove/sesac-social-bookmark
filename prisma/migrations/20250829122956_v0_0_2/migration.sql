/*
  Warnings:

  - You are about to drop the column `remark` on the `Mark` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Mark` DROP COLUMN `remark`,
    ADD COLUMN `descript` VARCHAR(512) NULL;
