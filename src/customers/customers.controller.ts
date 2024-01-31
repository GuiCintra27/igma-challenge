import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { CustomersService } from './customers.service';
import { FindAllParamsDto } from './dto/find-all-params.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { FindByCPFParamsDto } from './dto/find-by-cpf-params.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createCustomerDto: CreateCustomerDto,
  ) {
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
  findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    )
    { page }: FindAllParamsDto,
  ) {
    try {
      return this.customersService.findAll({
        page,
      });
    } catch (error) {
      if (error.name === 'InvalidDataError' && error.message) {
        throw new HttpException(error.message, error.status);
      }

      throw new Error(error);
    }
  }

  @Get('CPF')
  findByCPF(
    @Query(new ValidationPipe())
    { cpf }: FindByCPFParamsDto,
  ) {
    try {
      return this.customersService.findByCPF({
        cpf,
      });
    } catch (error) {
      if (error.name === 'InvalidDataError' && error.message) {
        throw new HttpException(error.message, error.status);
      }

      throw new Error(error);
    }
  }
}
