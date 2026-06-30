import { BaseStatisticsDto } from './base-statistics.dto';
import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CategoryReportDto extends BaseStatisticsDto {
 @ApiPropertyOptional({
    enum: ['expense', 'income', 'all'],
    example: 'all',
    description: 'Filter by transaction type',
  })
  @IsOptional()
  @IsIn(['expense', 'income', 'all'])
  @Transform(({ value }) => value ?? 'all')
  type?: 'expense' | 'income' | 'all' = 'all';
}