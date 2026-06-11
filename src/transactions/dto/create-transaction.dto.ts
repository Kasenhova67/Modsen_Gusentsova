import { IsUUID, IsNumber, IsString, IsDateString, IsPositive, IsOptional, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  categoryId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsIn(['expense', 'income'])
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: string;
}