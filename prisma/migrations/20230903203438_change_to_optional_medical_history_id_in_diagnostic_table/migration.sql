/*
  Warnings:

  - You are about to drop the column `medicalHistoryId` on the `diagnostic` table. All the data in the column will be lost.
  - You are about to drop the `surgical_intervention` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[medical_history_id]` on the table `diagnostic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "surgical_intervention" DROP CONSTRAINT "sugical_intervation_diagnostic_id_fkey";

-- AlterTable
ALTER TABLE "diagnostic" DROP COLUMN "medicalHistoryId",
ADD COLUMN     "medical_history_id" INTEGER;

-- DropTable
DROP TABLE "surgical_intervention";

-- CreateTable
CREATE TABLE "sugical_intervention" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "intervation_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "diagnostic_id" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "sugical_intervention_id_key" ON "sugical_intervention"("id");

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_medical_history_id_key" ON "diagnostic"("medical_history_id");

-- AddForeignKey
ALTER TABLE "sugical_intervention" ADD CONSTRAINT "sugical_intervention_diagnostic_id_fkey" FOREIGN KEY ("diagnostic_id") REFERENCES "diagnostic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
