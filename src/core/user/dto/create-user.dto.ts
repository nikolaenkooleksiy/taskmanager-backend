import { AuthProvider } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string | null;

  @IsString()
  providerId: string;

  @IsEnum(AuthProvider)
  provider: AuthProvider;
}
