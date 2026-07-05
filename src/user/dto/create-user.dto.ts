import { IsEmail, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsUrl()
  avatarUrl: string;

  @IsString()
  providerId: string;
}
