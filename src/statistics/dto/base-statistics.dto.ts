import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseStatisticsDto {
  @ApiPropertyOptional({ example: '2025-01-01', description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dateTo?: string;
}