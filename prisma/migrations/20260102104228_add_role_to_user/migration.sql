-- CreateEnum
CREATE TYPE "UserRolesEnum" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRolesEnum" NOT NULL DEFAULT 'user';
