import { IsString, IsNotEmpty, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SearchInstrumentsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  query: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}