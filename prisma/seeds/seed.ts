import { PrismaClient, Category, Prisma } from "@prisma/client";
import { Logger } from "@nestjs/common";

const prisma = new PrismaClient();

interface Product {
    nameProduct: string;
    descriptionProduct: string;
    category: Category;
    sizeProduct: string;
    sellingProduct: number;
}
const products: Product[] = [
    {
        nameProduct: 'Collar de Cuero',
        descriptionProduct: 'Collar ajustable de cuero genuino para perros',
        category: Category.accesorios,
        sizeProduct: 'Mediano',
        sellingProduct: 29.99
    },
    {
        nameProduct: 'Comida Seca para Gato',
        descriptionProduct: 'Alimento balanceado para gatos adultos',
        category: Category.alimentos,
        sizeProduct: '2 kg',
        sellingProduct: 19.99
    },
    {
        nameProduct: 'Cama Ortopédica para Perros',
        descriptionProduct: 'Cama cómoda y ortopédica para perros mayores',
        category: Category.bienestar,
        sizeProduct: 'Grande',
        sellingProduct: 59.99
    },
    {
        nameProduct: 'Clicker de Entrenamiento',
        descriptionProduct: 'Clicker para entrenamiento positivo de mascotas',
        category: Category.entrenamiento,
        sizeProduct: 'Pequeño',
        sellingProduct: 9.99
    },
    {
        nameProduct: 'Champú para Perros',
        descriptionProduct: 'Champú natural para perros con piel sensible',
        category: Category.higiene,
        sizeProduct: '500 ml',
        sellingProduct: 12.99
    },
    {
        nameProduct: 'Pelota de Caucho',
        descriptionProduct: 'Pelota resistente para jugar con perros',
        category: Category.juguetes,
        sizeProduct: 'Mediano',
        sellingProduct: 14.99
    },
    {
        nameProduct: 'Vitaminas para Perros',
        descriptionProduct: 'Suplemento vitamínico para perros de todas las edades',
        category: Category.bienestar,
        sizeProduct: '60 tabletas',
        sellingProduct: 24.99
    },
    {
        nameProduct: 'Jaula para Pájaros',
        descriptionProduct: 'Jaula espaciosa para pájaros pequeños y medianos',
        category: Category.accesorios,
        sizeProduct: 'Grande',
        sellingProduct: 89.99
    },
    {
        nameProduct: 'Kit de Limpieza Dental',
        descriptionProduct: 'Kit completo para la higiene dental de perros',
        category: Category.higiene,
        sizeProduct: 'Kit',
        sellingProduct: 19.99
    },
    {
        nameProduct: 'Comida Húmeda para Perros',
        descriptionProduct: 'Comida húmeda premium para perros',
        category: Category.alimentos,
        sizeProduct: '400 g',
        sellingProduct: 3.99
    },
    {
        nameProduct: 'Transportadora para Gatos',
        descriptionProduct: 'Transportadora segura y cómoda para gatos',
        category: Category.transporte,
        sizeProduct: 'Mediano',
        sellingProduct: 39.99
    },
    {
        nameProduct: 'Termostato para Terrario',
        descriptionProduct: 'Termostato digital para control de temperatura en terrarios',
        category: Category.terrario_acuario,
        sizeProduct: 'Único',
        sellingProduct: 49.99
    },
    {
        nameProduct: 'Rascador para Gatos',
        descriptionProduct: 'Rascador vertical con plataforma para gatos',
        category: Category.accesorios,
        sizeProduct: 'Grande',
        sellingProduct: 74.99
    },
    {
        nameProduct: 'Bebedero Automático',
        descriptionProduct: 'Bebedero automático para mascotas',
        category: Category.accesorios,
        sizeProduct: '2 L',
        sellingProduct: 29.99
    },
    {
        nameProduct: 'Juguete de Cuerda',
        descriptionProduct: 'Juguete de cuerda resistente para perros',
        category: Category.juguetes,
        sizeProduct: 'Mediano',
        sellingProduct: 11.99
    },
    {
        nameProduct: 'Antiparasitario para Gatos',
        descriptionProduct: 'Tratamiento antiparasitario para gatos',
        category: Category.medicamento,
        sizeProduct: '4 pipetas',
        sellingProduct: 34.99
    },
    {
        nameProduct: 'Calcio para Reptiles',
        descriptionProduct: 'Suplemento de calcio para reptiles en polvo',
        category: Category.bienestar,
        sizeProduct: '150 g',
        sellingProduct: 15.99
    },
    {
        nameProduct: 'Arenero para Gatos',
        descriptionProduct: 'Arenero cerrado con filtro para gatos',
        category: Category.accesorios,
        sizeProduct: 'Grande',
        sellingProduct: 49.99
    },
    {
        nameProduct: 'Correa Extensible',
        descriptionProduct: 'Correa extensible para perros de hasta 50 kg',
        category: Category.accesorios,
        sizeProduct: '5 m',
        sellingProduct: 25.99
    },
    {
        nameProduct: 'Arena para Gatos',
        descriptionProduct: 'Arena aglomerante sin polvo para gatos',
        category: Category.higiene,
        sizeProduct: '10 kg',
        sellingProduct: 18.99
    }
];

export const reportTypes = {
    "STRATEGIC_REPORT": {
        name: 'Informe de Ingresos por Ventas de Productos y Medicamentos'
    },
    "TACTICAL_REPORT": {
        name: 'Informe sobre el Registro de Citas Veterinarias Programadas',
    }
}

async function main() {
    Logger.log('Seeding started', 'Seeder');

    const [storedProducts, storedReportType] = await Promise.all([
        prisma.product.findMany(),
        prisma.reportType.findMany()
    ])

    for await (const product of products) {
        const existingProduct = storedProducts.find((p) => p.nameProduct === product.nameProduct);

        if (!existingProduct) {
            const newProduct = await prisma.product.create({
                data: product,
            });
            storedProducts.push(newProduct);
            Logger.log(`Product ${newProduct.nameProduct} created`, 'Seeder');
        }
    }

    function getRandomDate(start: Date, end: Date): Date {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function generateBillDetails(numberOfDetails: number) {
        const details = [];
        const usedProductIds = new Set();
        let totalSales = 0;

        for (let i = 0; i < numberOfDetails; i++) {
            let product;

            // Ensure unique productId for each bill detail
            do {
                product = storedProducts[Math.floor(Math.random() * products.length)];
            } while (usedProductIds.has(product.id));

            usedProductIds.add(product.id);

            const quantity = Math.floor(Math.random() * 5) + 1;
            const unitPrice = product.sellingProduct;
            const taxableSales = unitPrice * quantity;

            totalSales += taxableSales;

            details.push({
                quantity,
                description: product.nameProduct,
                unitPrice,
                exemptSales: 0,
                nonTaxableSales: 0,
                taxableSales,
                productId: product.id,
            });
        }

        return { details, totalSales };
    }

    const bills: Prisma.BillCreateInput[]  = [];

    for (let i = 1; i <= 150; i++) {
        const clientId = Math.floor(Math.random() * 3) + 1;
        const numberOfDetails = Math.floor(Math.random() * 5) + 1;
        const { details, totalSales } = generateBillDetails( numberOfDetails);

        bills.push({
            totalSales: +totalSales.toFixed(2),
            client: {
                connect: {
                    id: clientId,
                },
            },
            billsDetails: {
                createMany: {
                    data: details
                }},
            createdAt: getRandomDate(new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000), new Date()).toISOString(),
        });
    }

    await prisma.$transaction(async (tPrisma)=>{
        for await (const bill of bills) {
            const newBill = await tPrisma.bill.create({
                data: bill,
            });
            Logger.log(`Bill created id: ${newBill.id}, totalSale: ${newBill.totalSales}`, 'Seeder');
        }
    });

    for await (const reportType of Object.values(reportTypes)) {
        const existingReportType = storedReportType.find((rt) => rt.name === reportType.name);

        if (!existingReportType) {
            const newReportType = await prisma.reportType.create({
                data: reportType,
            });
            Logger.log(`ReportType ${newReportType.name} created`, 'Seeder');
        }
    }
}

main()
    .catch((e) => {
        Logger.error(e, e.stack, 'Seeder');
    })
    .finally(async () => {
        await prisma.$disconnect();
    });