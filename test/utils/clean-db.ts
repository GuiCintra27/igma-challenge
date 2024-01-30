import { PrismaService } from 'src/prisma/prisma/prisma.service';

export async function cleanDB() {
  const prismaService = new PrismaService({
    datasourceUrl: process.env.DATABASE_TEST_URL,
  });
  try {
    await prismaService.$transaction([prismaService.customer.deleteMany()]);
  } catch (error) {
    throw new Error(error);
  }
}
