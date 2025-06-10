-- CreateEnum
CREATE TYPE "Defficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defficulty" "Defficulty" NOT NULL DEFAULT 'EASY',

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);
