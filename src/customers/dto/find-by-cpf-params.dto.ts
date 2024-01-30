import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { IsCPF } from 'src/commom/validators/is-cpf.validator';

export class FindByCPFParamsDto {
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(14)
  @IsCPF({ message: 'Invalid CPF format' })
  public readonly cpf: string;
}
