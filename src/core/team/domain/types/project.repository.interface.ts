import { ProjectResponseDto } from '../../dto/project-response.dto';
import { Project } from '../model/project.model';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export type ProjectWithStats = ProjectResponseDto & {
  tasksTotal: number;
  tasksDone: number;
};
export interface IProjectRepository {
  findAll(teamId: string, userId: string): Promise<Project[]>;

  findById(projectId: string, userId: string): Promise<Project>;

  create(project: Project): Promise<Project>;

  update(
    projectId: string,
    userId: string,
    project: Partial<Project>,
  ): Promise<Project | null>;

  delete(projectId: string, userId: string): Promise<void>;

  getProjectsStats(teamId: string): Promise<ProjectWithStats[]>;
}
