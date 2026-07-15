import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(3, { message: 'Title must be contain more 3 characters' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  projectId: string;
}
