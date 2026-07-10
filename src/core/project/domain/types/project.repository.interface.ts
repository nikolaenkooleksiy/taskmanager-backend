import { Project } from '../model/project.model';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(projectId: string): Promise<Project>;
  findByUserId(userId: string): Promise<Project[]>;
  create(project: Project): Promise<Project>;
  update(projectId: string, project: Partial<Project>): Promise<Project>;
  delete(projectId: string): Promise<void>;
}
