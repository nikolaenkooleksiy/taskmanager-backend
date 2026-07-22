import { Team } from '../model/team.model';

export const TEAM_REPOSITORY = Symbol('TEAM_REPOSITORY');

export interface TeamStats {
  projectsCount: number;
  tasksCount: number;
  usersCount: number;
}

export interface ITeamRepository {
  findAll(ownerId: string): Promise<Team[]>;

  findById(teamId: string, ownerId: string): Promise<Team>;
  findByName(name: string, ownerId: string): Promise<Team>;

  create(team: Team): Promise<Team>;
  update(team: Partial<Team>): Promise<Team>;

  delete(teamId: string, ownerId: string): Promise<void>;
}
