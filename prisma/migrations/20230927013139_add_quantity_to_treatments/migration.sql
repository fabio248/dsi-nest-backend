/*
  Warnings:

  - You are about to drop the column `frecuency` on the `treatment` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `frequency` to the `treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Category" ADD VALUE 'medicamento';

-- AlterTable
ALTER TABLE "treatment" DROP COLUMN "frecuency",
ADD COLUMN     "frequency" TEXT NOT NULL,
ADD COLUMN     "quantity" TEXT;

-- DropTable
ALTER TABLE "Product" RENAME TO "product";