-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `member` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(15) NOT NULL,
    `withdel` BOOLEAN NOT NULL DEFAULT false,
    `ispublic` BOOLEAN NOT NULL DEFAULT false,
    `remark` VARCHAR(512) NULL,

    INDEX `fk_Book_member`(`member`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FollowBook` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `book` INTEGER UNSIGNED NOT NULL,
    `member` INTEGER UNSIGNED NULL,

    INDEX `fk_FollowBook_book`(`book`),
    INDEX `fk_FollowBook_member`(`member`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `mark` INTEGER UNSIGNED NOT NULL,
    `member` INTEGER UNSIGNED NULL,

    INDEX `fk_Likes_mark`(`mark`),
    INDEX `fk_Likes_member`(`member`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mark` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `book` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(15) NOT NULL,
    `link` VARCHAR(512) NOT NULL,
    `image` VARCHAR(255) NULL,
    `maker` INTEGER UNSIGNED NULL,
    `remark` VARCHAR(512) NULL,

    INDEX `fk_Mark_book`(`book`),
    INDEX `fk_Mark_maker_Member`(`maker`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `nickname` VARCHAR(21) NOT NULL,
    `email` VARCHAR(128) NOT NULL,
    `passwd` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `isadmin` BOOLEAN NOT NULL DEFAULT false,
    `emailcheck` VARCHAR(256) NULL,
    `outdt` VARCHAR(10) NULL,
    `descript` VARCHAR(512) NULL,

    UNIQUE INDEX `uniq_Member_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `mark` INTEGER UNSIGNED NOT NULL,
    `member` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_Report_mark`(`mark`),
    INDEX `fk_Report_member`(`member`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Talk` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `mark` INTEGER UNSIGNED NOT NULL,
    `member` INTEGER UNSIGNED NULL,
    `msg` VARCHAR(511) NOT NULL,

    INDEX `fk_Talk_mark`(`mark`),
    INDEX `fk_Talk_member`(`member`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `fk_Book_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowBook` ADD CONSTRAINT `fk_FollowBook_book` FOREIGN KEY (`book`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowBook` ADD CONSTRAINT `fk_FollowBook_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `fk_Likes_mark` FOREIGN KEY (`mark`) REFERENCES `Mark`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `fk_Likes_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mark` ADD CONSTRAINT `fk_Mark_book` FOREIGN KEY (`book`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mark` ADD CONSTRAINT `fk_Mark_maker_Member` FOREIGN KEY (`maker`) REFERENCES `Member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `fk_Report_mark` FOREIGN KEY (`mark`) REFERENCES `Mark`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `fk_Report_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Talk` ADD CONSTRAINT `fk_Talk_mark` FOREIGN KEY (`mark`) REFERENCES `Mark`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Talk` ADD CONSTRAINT `fk_Talk_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
