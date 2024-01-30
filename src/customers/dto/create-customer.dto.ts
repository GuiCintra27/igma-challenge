import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsBirthDate } from 'src/commom/validators/is-birth-date.validator';
import { IsCPF } from 'src/commom/validators/is-cpf.validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public readonly name: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(14)
  @IsCPF({ message: 'Invalid CPF format' })
  public readonly cpf: string;

  @IsNotEmpty()
  @IsBirthDate({ message: 'Invalid birth date' })
  @Type(() => Date)
  public readonly birthDate: Date;
}
