import { Type } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import IPagination from '../interfaces/pagination.interface';

export class PaginationDTO implements IPagination {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  offset: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(500)
  @ApiProperty({ minimum: 0, maximum: 500 })
  limit: number;
}
