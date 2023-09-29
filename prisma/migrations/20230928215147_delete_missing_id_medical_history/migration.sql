/*
  Warnings:

  - You are about to drop the column `diagnostic_id` on the `medical_history` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[medical_history_id]` on the table `diagnostic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "medical_history" DROP CONSTRAINT "medical_history_diagnostic_id_fkey";

-- DropIndex
DROP INDEX "medical_history_diagnostic_id_key";

-- AlterTable
ALTER TABLE "medical_history" DROP COLUMN "diagnostic_id";

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_medical_history_id_key" ON "diagnostic"("medical_history_id");

-- AddForeignKey
ALTER TABLE "diagnostic" ADD CONSTRAINT "diagnostic_medical_history_id_fkey" FOREIGN KEY ("medical_history_id") REFERENCES "medical_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Product_id_key" RENAME TO "product_id_key";
