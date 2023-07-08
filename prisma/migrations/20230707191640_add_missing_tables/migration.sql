/*
  Warnings:

  - You are about to drop the `base` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "pet" ADD COLUMN     "medical_history_id" INTEGER;

-- DropTable
DROP TABLE "base";

-- CreateTable
CREATE TABLE "medical_history" (
    "id" SERIAL NOT NULL,
    "is_have_all_vaccine" BOOLEAN NOT NULL,
    "is_reproduced" BOOLEAN NOT NULL,
    "descendants" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "diases_evaluation" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "food_id" INTEGER NOT NULL,
    "phisical_exam_id" INTEGER NOT NULL,
    "other_pet_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "food" (
    "id" SERIAL NOT NULL,
    "quantity" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "physical_exam" (
    "id" SERIAL NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "palpitations" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "other_pet" (
    "id" SERIAL NOT NULL,
    "is_live_other_pets" BOOLEAN NOT NULL,
    "whichPets" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "name" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "medical_history_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" SERIAL NOT NULL,
    "name" BOOLEAN NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "client_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "medical_history_id_key" ON "medical_history"("id");

-- CreateIndex
CREATE UNIQUE INDEX "food_id_key" ON "food"("id");

-- CreateIndex
CREATE UNIQUE INDEX "physical_exam_id_key" ON "physical_exam"("id");

-- CreateIndex
CREATE UNIQUE INDEX "other_pet_id_key" ON "other_pet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "file_id_key" ON "file"("id");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_id_key" ON "appointment"("id");

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_medical_history_id_fkey" FOREIGN KEY ("medical_history_id") REFERENCES "medical_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_phisical_exam_id_fkey" FOREIGN KEY ("phisical_exam_id") REFERENCES "physical_exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_other_pet_id_fkey" FOREIGN KEY ("other_pet_id") REFERENCES "other_pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_medical_history_id_fkey" FOREIGN KEY ("medical_history_id") REFERENCES "medical_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
