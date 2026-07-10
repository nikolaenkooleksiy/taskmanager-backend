import { IsString, IsOptional, MinLength } from 'class-validator';

export class GenerateDescriptionDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  context?: string;
}
