/*
  Warnings:

  - You are about to drop the `Diagnostic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "medical_history" DROP CONSTRAINT "medical_history_diagnostic_id_fkey";

-- DropTable
DROP TABLE "Diagnostic";

-- CreateTable
CREATE TABLE "diagnostic" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "medicalHistoryId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "sugical_intervation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "intervation_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "diagnostic_id" INTEGER
);

-- CreateTable
CREATE TABLE "treatment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "frecuency" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "diagnostic_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_id_key" ON "diagnostic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sugical_intervation_id_key" ON "sugical_intervation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "treatment_id_key" ON "treatment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "treatment_diagnostic_id_key" ON "treatment"("diagnostic_id");

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_diagnostic_id_fkey" FOREIGN KEY ("diagnostic_id") REFERENCES "diagnostic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sugical_intervation" ADD CONSTRAINT "sugical_intervation_diagnostic_id_fkey" FOREIGN KEY ("diagnostic_id") REFERENCES "diagnostic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment" ADD CONSTRAINT "treatment_diagnostic_id_fkey" FOREIGN KEY ("diagnostic_id") REFERENCES "diagnostic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
