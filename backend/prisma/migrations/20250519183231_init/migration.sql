/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,slotId,status]` on the table `ParkingRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ParkingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "ParkingRequest" ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "totalCharge" DOUBLE PRECISION,
ADD COLUMN     "totalTime" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "roles";

-- CreateIndex
CREATE INDEX "ParkingRequest_status_idx" ON "ParkingRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingRequest_userId_slotId_status_key" ON "ParkingRequest"("userId", "slotId", "status");
