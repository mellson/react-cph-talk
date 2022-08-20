/*
  Warnings:

  - You are about to drop the column `friend` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "friend",
ADD COLUMN     "isFriend" BOOLEAN NOT NULL DEFAULT false;
