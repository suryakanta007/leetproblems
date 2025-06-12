/*
  Warnings:

  - Added the required column `codeSnippets` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constraints` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examples` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceSolution` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testcases` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "codeSnippets" JSONB NOT NULL,
ADD COLUMN     "constraints" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "editorial" TEXT,
ADD COLUMN     "examples" JSONB NOT NULL,
ADD COLUMN     "hints" TEXT,
ADD COLUMN     "referenceSolution" JSONB NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "testcases" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
