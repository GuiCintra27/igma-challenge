import { Controller, Get, Post, Body, HttpException } from '@nestjs/common';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      await this.customersService.create(createCustomerDto);
    } catch (error) {
      if (error.name === 'InvalidDataError' && error.message) {
        throw new HttpException(error.message, error.status);
      }

      throw new Error(error);
    }
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
