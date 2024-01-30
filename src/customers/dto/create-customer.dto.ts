import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsBirthDate } from 'src/commom/validators/is-birth-date.validator';
import { IsValidCPF } from 'src/commom/validators/is-valid-cpf.validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(14)
  @IsValidCPF({ message: 'Invalid CPF' })
  cpf: string;

  @IsNotEmpty()
  @IsBirthDate({ message: 'Invalid birth date' })
  birthdate: Date;
}
