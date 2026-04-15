import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.interpretation.count();
    console.log(`Database has ${count} interpretations.`);
    
    const sample = await prisma.interpretation.findFirst();
    console.log('Sample:', sample);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
