/*
  Warnings:

  - You are about to drop the `File2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mtn_reporte" DROP CONSTRAINT "mtn_reporte_archivo_fkey";

-- DropTable
DROP TABLE "File2";

-- CreateTable
CREATE TABLE "mnt_archivo" (
    "id" TEXT NOT NULL,
    "nombre_clave" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,
    "eliminado_en" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "mnt_archivo_id_key" ON "mnt_archivo"("id");

-- AddForeignKey
ALTER TABLE "mtn_reporte" ADD CONSTRAINT "mtn_reporte_archivo_fkey" FOREIGN KEY ("archivo") REFERENCES "mnt_archivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
