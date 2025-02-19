-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('JOURNAL_INTIME', 'ECRITURE_LIBRE', 'PROMPT_WRITING', 'COLLABORATIVE_WRITING');

-- CreateEnum
CREATE TYPE "CreativityLevel" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE');

-- CreateTable
CREATE TABLE "WritingEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "exerciseType" "ExerciseType" NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "inspiration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeWritingEntry" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "creativityLevel" "CreativityLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreeWritingEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptWritingEntry" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptWritingEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingPrompt" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WritingPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastWritingDay" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingStreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_entryId_key" ON "JournalEntry"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "FreeWritingEntry_entryId_key" ON "FreeWritingEntry"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "PromptWritingEntry_entryId_key" ON "PromptWritingEntry"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "WritingStreak_userId_key" ON "WritingStreak"("userId");

-- AddForeignKey
ALTER TABLE "WritingEntry" ADD CONSTRAINT "WritingEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WritingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeWritingEntry" ADD CONSTRAINT "FreeWritingEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WritingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptWritingEntry" ADD CONSTRAINT "PromptWritingEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WritingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptWritingEntry" ADD CONSTRAINT "PromptWritingEntry_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "WritingPrompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingStreak" ADD CONSTRAINT "WritingStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
