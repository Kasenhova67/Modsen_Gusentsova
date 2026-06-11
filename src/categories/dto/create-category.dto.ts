import { IsString, Length, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6})$/)
  color: string;
}