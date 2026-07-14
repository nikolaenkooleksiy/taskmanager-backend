/*
  Warnings:

  - The values [LOCAL,GOOGLE,GITHUB] on the enum `AuthProvider` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_PROGRESS,COMPLETED] on the enum `TodoStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `user_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `todos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('Startup', 'Enterprise', 'Free');

-- AlterEnum
BEGIN;
CREATE TYPE "AuthProvider_new" AS ENUM ('Local', 'GitHub', 'Google');
ALTER TABLE "public"."users" ALTER COLUMN "provider" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "provider" TYPE "AuthProvider_new" USING ("provider"::text::"AuthProvider_new");
ALTER TYPE "AuthProvider" RENAME TO "AuthProvider_old";
ALTER TYPE "AuthProvider_new" RENAME TO "AuthProvider";
DROP TYPE "public"."AuthProvider_old";
ALTER TABLE "users" ALTER COLUMN "provider" SET DEFAULT 'Local';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TodoStatus_new" AS ENUM ('Pending', 'InProgress', 'Completed');
ALTER TABLE "public"."todos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "todos" ALTER COLUMN "status" TYPE "TodoStatus_new" USING ("status"::text::"TodoStatus_new");
ALTER TYPE "TodoStatus" RENAME TO "TodoStatus_old";
ALTER TYPE "TodoStatus_new" RENAME TO "TodoStatus";
DROP TYPE "public"."TodoStatus_old";
ALTER TABLE "todos" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('Admin', 'User');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_fkey";

-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_userId_fkey";

-- DropIndex
DROP INDEX "users_providerId_key";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "user_id",
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "todos" DROP COLUMN "userId",
ADD COLUMN     "assignee_id" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'User',
ALTER COLUMN "provider" SET DEFAULT 'Local';

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TeamType" NOT NULL DEFAULT 'Free',
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "todos_project_id_idx" ON "todos"("project_id");

-- CreateIndex
CREATE INDEX "todos_assignee_id_idx" ON "todos"("assignee_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_providerId_key" ON "users"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
