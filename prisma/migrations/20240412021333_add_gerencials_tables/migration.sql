-- CreateTable
CREATE TABLE "mnt_usuario" (
    "id" TEXT NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "primer_apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "rol" TEXT,
    "telefono" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "direccion" TEXT,
    "dui" TEXT,
    "token_recuperacion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,
    "eliminado_en" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "mtn_reporte" (
    "id" TEXT NOT NULL,
    "rango_inicio" TIMESTAMP(3) NOT NULL,
    "rango_finalizacion" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,
    "eliminado_en" TIMESTAMP(3),
    "usuario_creador" TEXT NOT NULL,
    "archivo" TEXT NOT NULL,
    "tipo_reporte" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "File2" (
    "id" TEXT NOT NULL,
    "nombre_clave" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,
    "eliminado_en" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "ReportType" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,
    "eliminado_en" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "mnt_usuario_id_key" ON "mnt_usuario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "mnt_usuario_correo_key" ON "mnt_usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "mtn_reporte_id_key" ON "mtn_reporte"("id");

-- CreateIndex
CREATE UNIQUE INDEX "mtn_reporte_archivo_key" ON "mtn_reporte"("archivo");

-- CreateIndex
CREATE UNIQUE INDEX "File2_id_key" ON "File2"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReportType_id_key" ON "ReportType"("id");

-- AddForeignKey
ALTER TABLE "mtn_reporte" ADD CONSTRAINT "mtn_reporte_usuario_creador_fkey" FOREIGN KEY ("usuario_creador") REFERENCES "mnt_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mtn_reporte" ADD CONSTRAINT "mtn_reporte_archivo_fkey" FOREIGN KEY ("archivo") REFERENCES "File2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mtn_reporte" ADD CONSTRAINT "mtn_reporte_tipo_reporte_fkey" FOREIGN KEY ("tipo_reporte") REFERENCES "ReportType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
