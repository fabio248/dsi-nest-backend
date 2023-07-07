/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `specie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "specie_name_key" ON "specie"("name");
