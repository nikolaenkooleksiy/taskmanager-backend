import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Team } from '../../domain/model/team.model';
import { ITeamRepository } from '../../domain/types/team.repository.interface';
import { TeamMapper } from '../mapper/team.mapper';

@Injectable()
export class TeamRepository implements ITeamRepository {
  constructor(private readonly db: PrismaService) {}

  async findAll(ownerId: string): Promise<Team[]> {
    const teams = await this.db.team.findMany({
      where: {
        ownerId: ownerId,
      },
    });

    return teams.map((team) => TeamMapper.toDomain(team));
  }

  async findById(teamId: string, ownerId: string): Promise<Team> {
    const team = await this.db.team.findFirstOrThrow({
      where: {
        id: teamId,
        ownerId: ownerId,
      },
    });

    return TeamMapper.toDomain(team);
  }

  async findByName(name: string, ownerId: string): Promise<Team> {
    const team = await this.db.team.findFirstOrThrow({
      where: {
        name: name,
        ownerId: ownerId,
      },
    });

    return TeamMapper.toDomain(team);
  }

  async create(team: Team): Promise<Team> {
    const data = TeamMapper.toPersistence(team);

    const created = await this.db.team.create({ data });

    return TeamMapper.toDomain(created);
  }

  async update(team: Team): Promise<Team> {
    const data = TeamMapper.toPersistence(team);

    const updated = await this.db.team.update({
      where: {
        id: team.id,
      },
      data,
    });

    return TeamMapper.toDomain(updated);
  }

  async delete(teamId: string, ownerId: string): Promise<void> {
    await this.db.team.delete({
      where: {
        id: teamId,
        ownerId: ownerId,
      },
    });
  }
}
