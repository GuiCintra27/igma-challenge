import { Customer } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { FindByCPFParamsDto } from './dto/find-by-cpf-params.dto';
import { BadRequestError, ConflictError, NotFoundError } from 'src/errors';

type CustomerData = Omit<Customer, 'created_at' | 'updated_at'>;

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}

  private isValidCPF(cpf: string): boolean {
    const arr = new Array(9).fill(0);

    for (let i = 0; i < 9; i++) {
      arr[i] = parseInt(cpf[i]);
    }

    function verifyNextNumber(position: number, arr: number[]) {
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

    arr.push(verifyNextNumber(10, arr));
    arr.push(verifyNextNumber(11, arr));

    if (
      arr[arr.length - 2] === Number(cpf[cpf.length - 2]) &&
      arr[arr.length - 1] === Number(cpf[cpf.length - 1])
    )
      return true;
    else return false;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<void> {
    const { name, cpf, birthDate } = createCustomerDto;
    const cpfNumbers = cpf.replace(/\D/g, '');

    if (!this.isValidCPF(cpfNumbers))
      throw new BadRequestError({
        message: 'Invalid CPF',
      });

    const cpfAlreadyExists = await this.prismaService.customer.findUnique({
      where: {
        cpf: cpfNumbers,
      },
    });

    if (cpfAlreadyExists)
      throw new ConflictError({
        message: 'Customer already exists',
      });

    await this.prismaService.$transaction([
      this.prismaService.customer.create({
        data: {
          name,
          cpf: cpfNumbers,
          birth_date: new Date(birthDate),
        },
      }),
    ]);
  }

  async findAll({
    page,
  }: {
    page?: number;
  }): Promise<{ customers: CustomerData[]; pagesCount: number }> {
    const [customers, pagesCount] = await this.prismaService.$transaction([
      this.prismaService.customer.findMany({
        select: {
          id: true,
          name: true,
          cpf: true,
          birth_date: true,
        },
        skip: page ? (page - 1) * 10 : 0,
        take: 10,
      }),
      this.prismaService.customer.count(),
    ]);

    if (page) {
      if (customers.length === 0)
        throw new NotFoundError({
          message: 'Customers not found',
        });
    }

    return {
      customers,
      pagesCount: Math.ceil(pagesCount / 10),
    };
  }

  async findByCPF({ cpf }: FindByCPFParamsDto): Promise<CustomerData> {
    const cpfNumbers = cpf.replace(/\D/g, '');

    if (!this.isValidCPF(cpfNumbers)) {
      throw new BadRequestError({
        message: 'Invalid CPF',
      });
    }

    const customer = await this.prismaService.customer.findUnique({
      select: {
        id: true,
        name: true,
        cpf: true,
        birth_date: true,
      },
      where: {
        cpf: cpfNumbers,
      },
    });

    if (!customer)
      throw new NotFoundError({
        message: 'Customer not found',
      });

    return customer;
  }
}
