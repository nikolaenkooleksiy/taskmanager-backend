import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  name: string;

  @IsString()
  teamId: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsUrl()
  @IsOptional()
  imageUrl?: string | null;
}
