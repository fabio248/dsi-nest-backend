-- CreateEnum
CREATE TYPE "Category" AS ENUM ('accesorios', 'alimentos', 'bienestar', 'entrenamiento', 'higiene', 'juguetes', 'reproduccion', 'terrario_acuario', 'transporte');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "nameProduct" TEXT NOT NULL,
    "descriptionProduct" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "sizeProduct" TEXT NOT NULL,
    "sellingProduct" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");
