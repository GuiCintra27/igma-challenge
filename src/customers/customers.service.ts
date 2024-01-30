import { Injectable } from '@nestjs/common';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { InvalidDataError } from 'src/errors/invalid-data-error';

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

    if (!this.isValidCPF(cpf.replace(/\D/g, '')))
      throw new InvalidDataError({
        message: 'Invalid CPF',
        name: 'InvalidDataError',
        status: 422,
      });

    await this.prismaService.$transaction([
      this.prismaService.customer.create({
        data: {
          name,
          cpf,
          birth_date: new Date(birthDate),
        },
      }),
    ]);
  }

  findAll() {
    return `This action returns all customers`;
  }
}
