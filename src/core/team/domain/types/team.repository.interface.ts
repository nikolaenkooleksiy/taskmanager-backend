import { Team } from '../model/team.model';

export const TEAM_REPOSITORY = Symbol('TEAM_REPOSITORY');

export interface ITeamRepository {
  findById(teamId: string): Promise<Team>;
  findByName(name: string): Promise<Team>;

  create(team: Team): Promise<void>;
  update(team: Team): Promise<void>;

  delete(teamId: string): Promise<void>;
}
