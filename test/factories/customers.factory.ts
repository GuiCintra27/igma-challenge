import { faker } from '@faker-js/faker';
import { Customer } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma/prisma.service';

type CustomerData = Omit<Customer, 'created_at' | 'updated_at'>;

export class CustomersFactory {
  constructor(private readonly prismaService: PrismaService) {}
  public CPFGenerator() {
    const cpf = [];

    for (let i = 0; i < 9; i++) {
      cpf.push(Math.floor(Math.random() * 10));
    }

    cpf.push(CustomersFactory.verifyNextNumber(10, cpf));
    cpf.push(CustomersFactory.verifyNextNumber(11, cpf));

    return cpf.join('');
  }

  private static verifyNextNumber(position, arr) {
    let sum = 0;
    for (let i = position; i > 1; i--) {
      const value = arr[arr.length - i + 1] * i;
      sum += value;

      if (i === 2) {
        const rest = sum % 11;

        if (rest < 2) return 0;
        else return 11 - rest;
      }
    }
  }

  public async createCustomers({
    qtd = 14,
  }: {
    qtd?: number;
  }): Promise<CustomerData[]> {
    const cpfs = [];

    for (let i = 0; i < qtd; i++) {
      cpfs.push(this.CPFGenerator());
    }

    const data = cpfs.map((cpf) => ({
      name: faker.person.firstName(),
      cpf,
      birth_date: faker.date.birthdate(),
    }));

    try {
      await this.prismaService.$transaction([
        this.prismaService.customer.createMany({
          data,
        }),
      ]);

      const customers = await this.findMany();

      return customers;
    } catch (error) {
      throw new Error('Error creating customers: ' + error);
    }
  }

  public async findMany(): Promise<CustomerData[]> {
    const customers = await this.prismaService.customer.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        birth_date: true,
      },
      take: 10,
    });
    return customers;
  }
}
