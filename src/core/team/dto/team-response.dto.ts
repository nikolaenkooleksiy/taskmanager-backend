import { TeamType } from '@prisma/client';

export class TeamResponseDto {
  id: string;
  name: string;
  type: TeamType;
}
