/*
  Warnings:

  - You are about to drop the `mnt_usuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `ctl_tipo_reporte` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `usuario_creador` on the `mtn_reporte` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "mtn_reporte" DROP CONSTRAINT "mtn_reporte_usuario_creador_fkey";

-- AlterTable
ALTER TABLE "mtn_reporte" ALTER COLUMN "rango_inicio" DROP NOT NULL,
ALTER COLUMN "rango_finalizacion" DROP NOT NULL,
DROP COLUMN "usuario_creador",
ADD COLUMN     "usuario_creador" INTEGER NOT NULL;

-- DropTable
DROP TABLE "mnt_usuario";

-- CreateIndex
CREATE UNIQUE INDEX "ctl_tipo_reporte_nombre_key" ON "ctl_tipo_reporte"("nombre");

-- AddForeignKey
ALTER TABLE "mtn_reporte" ADD CONSTRAINT "mtn_reporte_usuario_creador_fkey" FOREIGN KEY ("usuario_creador") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
