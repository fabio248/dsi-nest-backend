import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Especies base de la veterinaria. El nombre es unico, por lo que el upsert
// hace este seed idempotente: se puede correr varias veces sin duplicar filas.
const species = [
  'Felino',
  'Canino',
  'Cetoácidos',
  'Ofilio',
  'Roedor',
  'Saurio',
  'Quelonios',
];

async function main() {
  for (const name of species) {
    await prisma.specie.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`Seed de especies completado: ${species.length} especies.`);
}

main()
  .catch((error) => {
    console.error('Error al ejecutar el seed de especies:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
