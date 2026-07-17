import { Injectable } from '@nestjs/common';
import { Project } from '../../domain/model/project.model';
import { IProjectRepository } from '../../domain/types/project.repository.interface';

@Injectable()
export class InMemoryProjectRepository implements IProjectRepository {
  private readonly projects = new Map<string, Project>();

  findAll(teamId: string): Promise<Project[]> {
    const projects = Array.from(this.projects.values()).filter(
      (project) => project.teamId === teamId,
    );

    return Promise.resolve(projects);
  }

  findById(projectId: string): Promise<Project> {
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
    project: Partial<Project>,
  ): Promise<Project | null> {
    const existing = this.projects.get(projectId);
    if (!existing) {
      return Promise.resolve(null);
    }

    const updated = Project.restore({
      id: existing.id,
      name: project.name ?? existing.name,
      description:
        project.description !== undefined
          ? project.description
          : existing.description,
      icon: project.icon !== undefined ? project.icon : existing.icon,
      teamId: existing.teamId,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    this.projects.set(projectId, updated);

    return Promise.resolve(updated);
  }

  delete(projectId: string): Promise<void> {
    this.projects.delete(projectId);
    return Promise.resolve();
  }
}
