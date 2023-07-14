/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `file` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `folder_id` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "folder_id" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pet" ADD COLUMN     "folder_id" INTEGER;

-- CreateTable
CREATE TABLE "folder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "folder_id_key" ON "folder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "folder_name_key" ON "folder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "file_name_key" ON "file"("name");

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
