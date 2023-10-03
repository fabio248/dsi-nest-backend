/*
  Warnings:

  - You are about to drop the column `medical_history_id` on the `pet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pet" DROP CONSTRAINT "pet_medical_history_id_fkey";

-- AlterTable
ALTER TABLE "medical_history" ADD COLUMN     "pet_id" INTEGER;

-- AlterTable
ALTER TABLE "pet" DROP COLUMN "medical_history_id";

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
