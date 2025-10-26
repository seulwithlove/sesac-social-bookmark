/*
  Warnings:

  - A unique constraint covering the columns `[mark,member]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mark,member]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Made the column `member` on table `Likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maker` on table `Mark` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `fk_Likes_member`;

-- DropForeignKey
ALTER TABLE `Mark` DROP FOREIGN KEY `fk_Mark_maker_Member`;

-- AlterTable
ALTER TABLE `Likes` MODIFY `member` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Mark` MODIFY `title` VARCHAR(120) NOT NULL,
    MODIFY `link` VARCHAR(1024) NOT NULL,
    MODIFY `image` VARCHAR(512) NULL,
    MODIFY `maker` INTEGER UNSIGNED NOT NULL,
    MODIFY `descript` VARCHAR(1024) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Likes_mark_member_key` ON `Likes`(`mark`, `member`);

-- CreateIndex
CREATE UNIQUE INDEX `Report_mark_member_key` ON `Report`(`mark`, `member`);

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `fk_Likes_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mark` ADD CONSTRAINT `fk_Mark_maker_Member` FOREIGN KEY (`maker`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
