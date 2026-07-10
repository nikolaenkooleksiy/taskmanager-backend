import { Project } from '../model/project.model';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface IProjectRepository {
  findAll(userId: string): Promise<Project[]>;
  findById(projectId: string, userId: string): Promise<Project>;
  create(project: Project): Promise<Project>;
  update(
    projectId: string,
    project: Partial<Project>,
    userId: string,
  ): Promise<Project>;
  delete(projectId: string, userId: string): Promise<void>;
}
