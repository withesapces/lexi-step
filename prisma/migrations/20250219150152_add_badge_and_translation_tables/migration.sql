/*
  Warnings:

  - You are about to drop the column `description` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Badge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "conditionValue" INTEGER,
ADD COLUMN     "defaultDescription" TEXT,
ADD COLUMN     "defaultName" TEXT;

-- CreateTable
CREATE TABLE "BadgeTranslation" (
    "id" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BadgeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadgeTranslation_badgeId_locale_key" ON "BadgeTranslation"("badgeId", "locale");

-- AddForeignKey
ALTER TABLE "BadgeTranslation" ADD CONSTRAINT "BadgeTranslation_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
