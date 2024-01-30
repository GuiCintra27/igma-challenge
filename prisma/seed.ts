// prisma/seed.ts
import { Customer, Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  try {
    let customers: Customer[] | Prisma.BatchPayload =
      await prisma.customer.findMany();

    if (customers.length === 0) {
      const data = [];

      for (let i = 0; i < 30; i++) {
        data.push({
          name: `Customer ${i + 1}`,
          cpf: `123456789${i + 1 > 9 ? i + 1 : `0${i + 1}`}`,
          birth_date: faker.date.birthdate(),
        });
      }

      customers = await prisma.customer.createMany({
        data,
      });
    }

    // eslint-disable-next-line no-console
    console.log('Seeding completed successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`\nError seeding database: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
