import { Team } from '../../domain/model/team.model';

import { Team as PrismaTeam } from '@prisma/client';
import { TeamResponseDto } from '../../dto/team-response.dto';

export class TeamMapper {
  static toDomain(dto: PrismaTeam): Team {
    return Team.restore({ ...dto });
  }

  static toResponse(team: Team): TeamResponseDto {
    return {
      id: team.id,
      name: team.name,
      type: team.type,
    };
  }

  static toPersistence(team: Team) {
    return {
      id: team.id,
      name: team.name,
      type: team.type,
      ownerId: team.ownerId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}
