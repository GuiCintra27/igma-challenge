import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FindAllParamsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public readonly page?: number;
}
