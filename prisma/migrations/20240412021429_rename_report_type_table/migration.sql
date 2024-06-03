/*
  Warnings:

  - You are about to drop the `ReportType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mtn_reporte" DROP CONSTRAINT "mtn_reporte_tipo_reporte_fkey";

-- DropTable
DROP TABLE "ReportType";

-- CreateTable
CREATE TABLE "ctl_tipo_reporte" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,
    "eliminado_en" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "ctl_tipo_reporte_id_key" ON "ctl_tipo_reporte"("id");

-- AddForeignKey
ALTER TABLE "mtn_reporte" ADD CONSTRAINT "mtn_reporte_tipo_reporte_fkey" FOREIGN KEY ("tipo_reporte") REFERENCES "ctl_tipo_reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
