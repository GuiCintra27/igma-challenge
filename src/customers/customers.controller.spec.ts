import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { mockCustomersService } from './mocks/customers-sevice.mock';

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [CustomersService],
    })
      .overrideProvider(CustomersService)
      .useValue(mockCustomersService)
      .compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When calling customerFindAll', () => {
    it('it should call customerFindAll function', () => {
      controller.findAll({});
      expect(mockCustomersService.findAll).toHaveBeenCalled();
    });

    it('it should return an array', async () => {
      const result = await controller.findAll({});
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('When calling findByCPF', () => {
    it('it should call findByCPF function', () => {
      controller.findByCPF({ cpf: '12345678901' });
      expect(mockCustomersService.findByCPF).toHaveBeenCalled();
    });

    it('it should return an object', async () => {
      const result = await controller.findByCPF({ cpf: '12345678901' });
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('When calling create', () => {
    it('it should call create function', () => {
      controller.create({
        name: 'John',
        cpf: '12345678901',
        birthDate: new Date(),
      });
      expect(mockCustomersService.create).toHaveBeenCalled();
    });
  });
});
