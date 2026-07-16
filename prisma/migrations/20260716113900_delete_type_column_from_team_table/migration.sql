/*
  Warnings:

  - You are about to drop the column `type` on the `teams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "teams" DROP COLUMN "type";

-- DropEnum
DROP TYPE "TeamType";
