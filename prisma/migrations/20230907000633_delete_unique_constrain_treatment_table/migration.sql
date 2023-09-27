-- DropIndex
DROP INDEX "treatment_diagnostic_id_key";

-- AlterTable
ALTER TABLE "treatment" ALTER COLUMN "diagnostic_id" DROP NOT NULL;
