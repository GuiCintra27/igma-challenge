import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { cleanDB } from './utils/clean-db';
import { AppModule } from './../src/app.module';
import { prismaService } from './utils/prisma-service-test';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CustomersFactory } from './factories/customers.factory';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const factory = new CustomersFactory(prismaService);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/customers (GET)', () => {
    it('when no customers are create, it should return an empty array', async () => {
      await cleanDB();
      const response = await request(app.getHttpServer()).get('/customers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        customers: [],
        pagesCount: 0,
      });
    });

    describe('When customers are create', () => {
      it('it should return an array of customers', async () => {
        await cleanDB();
        const customers = (await factory.createCustomers({})).map(
          (customer) => ({
            id: customer.id,
            name: customer.name,
            cpf: customer.cpf,
            birth_date: customer.birth_date.toISOString(),
          }),
        );
        const response = await request(app.getHttpServer()).get('/customers');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          customers,
          pagesCount: 2,
        });
      });

      describe('When query page have invalid format', () => {
        it('when query page is a string, it should return an error', async () => {
          const response = await request(app.getHttpServer())
            .get('/customers')
            .query({ page: 'a' });

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            error: 'Bad Request',
            message: [
              'page must be a positive number',
              'page must be an integer number',
            ],
            statusCode: 400,
          });
        });

        it('when query page is a non positive number, it should return an error', async () => {
          const response = await request(app.getHttpServer())
            .get('/customers')
            .query({ page: 0 });

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            error: 'Bad Request',
            message: ['page must be a positive number'],
            statusCode: 400,
          });
        });
      });

      it('when query page is greater than the number of pages, it should return an error', async () => {
        const response = await request(app.getHttpServer())
          .get('/customers')
          .query({ page: 3 });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          message: 'Customers not found',
          statusCode: 404,
        });
      });

      it('when query page is valid, it should return the customers', async () => {
        await cleanDB();
        const customers = (await factory.createCustomers({ page: 2 })).map(
          (customer) => ({
            id: customer.id,
            name: customer.name,
            cpf: customer.cpf,
            birth_date: customer.birth_date.toISOString(),
          }),
        );
        const response = await request(app.getHttpServer())
          .get('/customers')
          .query({ page: 2 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          customers,
          pagesCount: 2,
        });
      });
    });
  });

  describe('/customers/CPF (GET)', () => {
    it('when no CPF is given it should return an error', async () => {
      const response = await request(app.getHttpServer()).get('/customers/CPF');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: [
          'Invalid CPF format',
          'cpf must be shorter than or equal to 14 characters',
          'cpf must be longer than or equal to 11 characters',
          'cpf should not be empty',
        ],
        statusCode: 400,
      });
    });

    describe('When given CPF is invalid', () => {
      it('when given CPF have more than 14 characters, it should return an error', async () => {
        const cpfQuery = '123456789012345678';
        const response = await request(app.getHttpServer()).get(
          `/customers/CPF?cpf=${cpfQuery}`,
        );

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: 'Bad Request',
          message: [
            'Invalid CPF format',
            'cpf must be shorter than or equal to 14 characters',
          ],
          statusCode: 400,
        });
      });

      it('when given CPF have less than 11 characters, it should return an error', async () => {
        const cpfQuery = '1234567890';
        const response = await request(app.getHttpServer()).get(
          `/customers/CPF?cpf=${cpfQuery}`,
        );

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: 'Bad Request',
          message: [
            'Invalid CPF format',
            'cpf must be longer than or equal to 11 characters',
          ],
          statusCode: 400,
        });
      });

      it('when given CPF format is invalid, it should return an error', async () => {
        const cpfQuery = '123.456-789.01';
        const response = await request(app.getHttpServer()).get(
          `/customers/CPF?cpf=${cpfQuery}`,
        );

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: 'Bad Request',
          message: ['Invalid CPF format'],
          statusCode: 400,
        });
      });
    });

    it('when given CPF format is correct, but CPF is invalid, it should return an error', async () => {
      const cpfQuery = '123.456.789-01';
      const response = await request(app.getHttpServer()).get(
        `/customers/CPF?cpf=${cpfQuery}`,
      );

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'Invalid CPF',
        statusCode: 422,
      });
    });

    describe('When given CPF is valid', () => {
      it("when there's no customer with given CPF, it should return not found error", async () => {
        const cpfQuery = factory.CPFGenerator();
        const response = await request(app.getHttpServer()).get(
          `/customers/CPF?cpf=${cpfQuery}`,
        );

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          message: 'Customer not found',
          statusCode: 404,
        });
      });

      it('when there is a customer with given CPF, it should return the customer', async () => {
        const customer = await factory.createCustomers({ qtd: 1 });
        const response = await request(app.getHttpServer()).get(
          `/customers/CPF?cpf=${customer[0].cpf}`,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: customer[0].id,
          name: customer[0].name,
          cpf: customer[0].cpf,
          birth_date: customer[0].birth_date.toISOString(),
        });
      });
    });
  });

  describe('/customers (POST)', () => {
    it('when invalid name is given it should return an error', async () => {
      await request(app.getHttpServer())
        .post('/customers')
        .send({
          birthDate: new Date(),
          cpf: '12345678901',
        })
        .expect(400)
        .expect((res) =>
          expect(res.body).toEqual({
            error: 'Bad Request',
            message: [
              'name must be shorter than or equal to 255 characters',
              'name must be longer than or equal to 3 characters',
              'name must be a string',
              'name should not be empty',
            ],
            statusCode: 400,
          }),
        );

      await request(app.getHttpServer())
        .post('/customers')
        .send({
          birthDate: new Date(),
          cpf: '12345678901',
          name: 'ao',
        })
        .expect(400)
        .expect((res) =>
          expect(res.body).toEqual({
            error: 'Bad Request',
            message: ['name must be longer than or equal to 3 characters'],
            statusCode: 400,
          }),
        );

      await request(app.getHttpServer())
        .post('/customers')
        .send({
          birthDate: new Date(),
          cpf: '12345678901',
          name: faker.lorem.paragraphs(5),
        })
        .expect(400)
        .expect((res) =>
          expect(res.body).toEqual({
            error: 'Bad Request',
            message: ['name must be shorter than or equal to 255 characters'],
            statusCode: 400,
          }),
        );
    });

    it('when invalid birth date is given it should return an error', async () => {
      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'John Doe',
          cpf: '12345678901',
        })
        .expect(400)
        .expect((res) =>
          expect(res.body).toEqual({
            error: 'Bad Request',
            message: ['Invalid birth date', 'birthDate should not be empty'],
            statusCode: 400,
          }),
        );

      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'John Doe',
          birthDate: '2222/12/12',
          cpf: '12345678901',
        })
        .expect(400)
        .expect((res) =>
          expect(res.body).toEqual({
            error: 'Bad Request',
            message: ['Invalid birth date'],
            statusCode: 400,
          }),
        );
    });

    it('when no CPF is given it should return an error', async () => {
      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'John',
          birthDate: new Date(),
        })
        .expect(400)
        .expect((res) =>
          expect(res.body).toEqual({
            error: 'Bad Request',
            message: [
              'Invalid CPF format',
              'cpf must be shorter than or equal to 14 characters',
              'cpf must be longer than or equal to 11 characters',
              'cpf should not be empty',
            ],
            statusCode: 400,
          }),
        );
    });

    describe('When given body is valid', () => {
      it('when given CPF format is correct, but CPF is invalid, it should return an error', async () => {
        const invalidCPF = '123.456.789-01';
        await request(app.getHttpServer())
          .post('/customers')
          .send({
            name: 'John',
            birthDate: new Date(),
            cpf: invalidCPF,
          })
          .expect(422)
          .expect((res) =>
            expect(res.body).toEqual({
              message: 'Invalid CPF',
              statusCode: 422,
            }),
          );
      });

      it('when given CPF is valid, but is already in use, it should return an error', async () => {
        await cleanDB();
        const customer = await factory.createCustomers({ qtd: 1 });
        await request(app.getHttpServer())
          .post('/customers')
          .send({
            name: 'John',
            birthDate: new Date(),
            cpf: customer[0].cpf,
          })
          .expect(409)
          .expect((res) =>
            expect(res.body).toEqual({
              message: 'Customer already exists',
              statusCode: 409,
            }),
          );
      });

      it('when given body is valid, it should return created status', async () => {
        await request(app.getHttpServer())
          .post('/customers')
          .send({
            name: 'John',
            birthDate: new Date(),
            cpf: factory.CPFGenerator(),
          })
          .expect(201);
      });
    });

    // describe('When given CPF is valid', () => {
    //   it("when there's no customer with given CPF, it should return not found error", async () => {
    //     const cpfQuery = factory.CPFGenerator();
    //     const response = await request(app.getHttpServer()).get(
    //       `/customers/CPF?cpf=${cpfQuery}`,
    //     );

    //     expect(response.status).toBe(404);
    //     expect(response.body).toEqual({
    //       message: 'Customer not found',
    //       statusCode: 404,
    //     });
    //   });

    //   it('when there is a customer with given CPF, it should return the customer', async () => {
    //     const customer = await factory.createCustomers({ qtd: 1 });
    //     const response = await request(app.getHttpServer()).get(
    //       `/customers/CPF?cpf=${customer[0].cpf}`,
    //     );

    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual({
    //       id: customer[0].id,
    //       name: customer[0].name,
    //       cpf: customer[0].cpf,
    //       birth_date: customer[0].birth_date.toISOString(),
    //     });
    //   });
    // });
  });
});
