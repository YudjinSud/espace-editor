/*
  Warnings:

  - You are about to drop the column `userId` on the `Lieu` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lieu" DROP CONSTRAINT "Lieu_userId_fkey";

-- DropIndex
DROP INDEX "Lieu_userId_idx";

-- AlterTable
ALTER TABLE "Lieu" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
