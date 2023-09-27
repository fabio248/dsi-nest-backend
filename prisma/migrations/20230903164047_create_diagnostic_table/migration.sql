/*
  Warnings:

  - A unique constraint covering the columns `[diagnostic_id]` on the table `medical_history` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "medical_history" ADD COLUMN     "diagnostic_id" INTEGER;

-- AlterTable
ALTER TABLE "physical_exam" ADD COLUMN     "cardiac_rate" DOUBLE PRECISION,
ADD COLUMN     "laboratory_exam" TEXT,
ADD COLUMN     "mucous" TEXT,
ADD COLUMN     "pulse" TEXT,
ADD COLUMN     "respiratory_rate" DOUBLE PRECISION,
ADD COLUMN     "temperature" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "medicalHistoryId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Diagnostic_id_key" ON "Diagnostic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "medical_history_diagnostic_id_key" ON "medical_history"("diagnostic_id");

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_diagnostic_id_fkey" FOREIGN KEY ("diagnostic_id") REFERENCES "Diagnostic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
