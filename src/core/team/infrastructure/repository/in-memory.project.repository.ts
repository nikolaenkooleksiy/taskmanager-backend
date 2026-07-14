import { Injectable } from '@nestjs/common';
import { Project } from '../../domain/model/project.model';
import { IProjectRepository } from '../../domain/types/project.repository.interface';

@Injectable()
export class InMemoryProjectRepository implements IProjectRepository {
  private readonly projects = new Map<string, Project>();

  findAll(teamId: string, userId: string): Promise<Project[]> {
    const projects = Array.from(this.projects.values()).filter(
      (project) => project.teamId === teamId,
    );

    return Promise.resolve(projects);
  }

  findById(projectId: string, userId: string): Promise<Project> {
    const project = this.projects.get(projectId);
    if (!project) return Promise.reject(new Error('Project not found'));
    return Promise.resolve(project);
  }

  create(project: Project): Promise<Project> {
    this.projects.set(project.id, project);

    return Promise.resolve(project);
  }

  update(
    projectId: string,
    userId: string,
    project: Project,
  ): Promise<Project | null> {
    if (!this.projects.has(projectId)) {
      return Promise.resolve(null);
    }

    this.projects.set(projectId, project);

    return Promise.resolve(project);
  }

  delete(projectId: string, userId: string): Promise<void> {
    this.projects.delete(projectId);
    return Promise.resolve();
  }
}
