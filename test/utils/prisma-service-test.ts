import { PrismaService } from 'src/prisma/prisma/prisma.service';

export const prismaService = new PrismaService({
  datasourceUrl: process.env.DATABASE_TEST_URL,
});
