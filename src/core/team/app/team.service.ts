import { Inject, Injectable } from '@nestjs/common';
import { Team } from '../domain/model/team.model';
import {
  type ITeamRepository,
  TEAM_REPOSITORY,
} from '../domain/types/team.repository.interface';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { TeamMapper } from '../infrastructure/mapper/team.mapper';

@Injectable()
export class TeamService {
  constructor(
    @Inject(TEAM_REPOSITORY) private readonly teamRepository: ITeamRepository,
  ) {}

  async getTeamById(teamId: string, ownerId: string) {
    return TeamMapper.toResponse(
      await this.teamRepository.findById(teamId, ownerId),
    );
  }

  async getTeamByName(name: string, ownerId: string) {
    return TeamMapper.toResponse(
      await this.teamRepository.findByName(name, ownerId),
    );
  }

  async getAllTeams(ownerId: string) {
    return (await this.teamRepository.findAll(ownerId)).map((t) =>
      TeamMapper.toResponse(t),
    );
  }

  async createTeam(ownerId: string, dto: CreateTeamDto) {
    const team = Team.create({ ...dto, ownerId });

    await this.teamRepository.create(team);
  }

  async updateTeam(teamId: string, ownerId: string, dto: UpdateTeamDto) {
    return await this.teamRepository.update({ id: teamId, ...dto, ownerId });
  }

  async deleteTeam(teamId: string, ownerId: string) {
    return this.teamRepository.delete(teamId, ownerId);
  }

  async getTeamStats(teamId: string, ownerId: string) {
    return await this.teamRepository.getStats(teamId, ownerId);
  }
}
