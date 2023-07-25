-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_history" DROP CONSTRAINT "medical_history_food_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_history" DROP CONSTRAINT "medical_history_other_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_history" DROP CONSTRAINT "medical_history_phisical_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "pet" DROP CONSTRAINT "pet_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "pet" DROP CONSTRAINT "pet_medical_history_id_fkey";

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "folder_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_medical_history_id_fkey" FOREIGN KEY ("medical_history_id") REFERENCES "medical_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_phisical_exam_id_fkey" FOREIGN KEY ("phisical_exam_id") REFERENCES "physical_exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_other_pet_id_fkey" FOREIGN KEY ("other_pet_id") REFERENCES "other_pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
