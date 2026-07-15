import { TeamType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsEnum(() => TeamType)
  type: TeamType;
}
