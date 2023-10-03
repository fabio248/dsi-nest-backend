/*
  Warnings:

  - You are about to drop the column `medical_history_id` on the `diagnostic` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[diagnostic_id]` on the table `medical_history` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "diagnostic" DROP CONSTRAINT "diagnostic_medical_history_id_fkey";

-- DropIndex
DROP INDEX "diagnostic_medical_history_id_key";

-- AlterTable
ALTER TABLE "diagnostic" DROP COLUMN "medical_history_id";

-- AlterTable
ALTER TABLE "medical_history" ADD COLUMN     "diagnostic_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "medical_history_diagnostic_id_key" ON "medical_history"("diagnostic_id");

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_diagnostic_id_fkey" FOREIGN KEY ("diagnostic_id") REFERENCES "diagnostic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
