import { BaseStatisticsDto } from "./base-statistics.dto";
import { IsOptional,IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryReportDto extends BaseStatisticsDto {
 @ApiPropertyOptional({
    enum: ['expense', 'income', 'all'],
    example: 'all',
    description: 'Filter by transaction type',
  })
  @IsOptional()
  @IsIn(['expense', 'income', 'all'])
  type?: 'expense' | 'income' | 'all' = 'all'; 
}