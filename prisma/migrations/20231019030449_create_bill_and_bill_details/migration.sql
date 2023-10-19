-- CreateTable
CREATE TABLE "bill" (
    "id" SERIAL NOT NULL,
    "totalSales" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "client_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "bill_detail" (
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "exempt_sales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "non_taxable_sales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sub_total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "bill_detail_pkey" PRIMARY KEY ("bill_id","product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bill_id_key" ON "bill"("id");

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_detail" ADD CONSTRAINT "bill_detail_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_detail" ADD CONSTRAINT "bill_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
