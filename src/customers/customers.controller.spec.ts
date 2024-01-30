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
      controller.findAll();
      expect(mockCustomersService.findAll).toHaveBeenCalled();
    });

    it('it should return an array', async () => {
      const result = await controller.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });
});
