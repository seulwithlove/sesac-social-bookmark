/*
  Warnings:

  - A unique constraint covering the columns `[book,member]` on the table `FollowBook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `FollowBook_book_member_key` ON `FollowBook`(`book`, `member`);
