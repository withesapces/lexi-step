/*
  Warnings:

  - You are about to drop the column `creativityLevel` on the `FreeWritingEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FreeWritingEntry" DROP COLUMN "creativityLevel";

-- AlterTable
ALTER TABLE "WritingEntry" ADD COLUMN     "userMood" TEXT;
