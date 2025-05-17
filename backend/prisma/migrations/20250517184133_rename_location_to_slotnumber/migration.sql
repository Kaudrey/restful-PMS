/*
  Warnings:

  - A unique constraint covering the columns `[slotNumber]` on the table `ParkingSlot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slotNumber` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSlot" ADD COLUMN     "slotNumber" TEXT NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSlot_slotNumber_key" ON "ParkingSlot"("slotNumber");
