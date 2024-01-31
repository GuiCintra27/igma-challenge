import { Test, TestingModule } from '@nestjs/testing';

import { cleanDB } from '../../test/utils/clean-db';
import { CustomersService } from './customers.service';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { prismaService } from '../../test/utils/prisma-service-test';
import { CustomersFactory } from '../../test/factories/customers.factory';

describe('CustomersService', () => {
  let service: CustomersService;
  const factory = new CustomersFactory(prismaService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When calling findAll', () => {
    it('when no customers are create, it should return an empty array', async () => {
      await cleanDB();
      const result = await service.findAll({});

      expect(result).toEqual({
        customers: [],
        pagesCount: 0,
      });
    });

    describe('when customers are create', () => {
      it('it should return an array of customers', async () => {
        await cleanDB();
        const customers = await factory.createCustomers({});

        const result = await service.findAll({});

        expect(result).toEqual({
          customers,
          pagesCount: 1,
        });
      });

      it('it should throw an error if there are no customers for the given page', async () => {
        await expect(service.findAll({ page: 3 })).rejects.toThrow(
          'Customers not found',
        );
      });
    });
  });

  describe('When calling findByCPF', () => {
    it('it should throw an error if the customer does not exist', async () => {
      await expect(service.findByCPF({ cpf: '12345678901' })).rejects.toThrow(
        'Customer not found',
      );
    });

    describe('When a valid CPF is given', () => {
      it('it should return the customer', async () => {
        await cleanDB();
        const customer = await factory.createCustomers({ qtd: 1 });

        const result = await service.findByCPF({ cpf: customer[0].cpf });
        expect(result).toEqual(customer[0]);
      });
    });
  });

  describe('When calling create', () => {
    it('it should throw an error if given CPF is invalid', async () => {
      await expect(
        service.create({
          name: 'John',
          cpf: '12345678901',
          birthDate: new Date(),
        }),
      ).rejects.toThrow('Invalid CPF');
    });

    it('it should throw an error if given customer already exists', async () => {
      await cleanDB();
      const customer = await factory.createCustomers({ qtd: 1 });
      await expect(
        service.create({
          name: 'John',
          cpf: customer[0].cpf,
          birthDate: new Date(),
        }),
      ).rejects.toThrow('Customer already exists');
    });

    describe('When a valid customer is given', () => {
      it('it should create the customer', async () => {
        await cleanDB();
        const customer = {
          name: 'John',
          cpf: factory.CPFGenerator(),
          birthDate: new Date(),
        };

        await service.create(customer);

        const result = await service.findByCPF({ cpf: customer.cpf });
        expect(result).toEqual(
          expect.objectContaining({
            name: customer.name,
            cpf: customer.cpf,
            birth_date: customer.birthDate,
          }),
        );
      });
    });
  });
});
