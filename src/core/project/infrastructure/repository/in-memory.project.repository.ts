import { Injectable } from '@nestjs/common';
import { Project } from '../../domain/model/project.model';
import { type IProjectRepository } from '../../domain/types/project.repository.interface';

@Injectable()
export class InMemoryProjectRepository implements IProjectRepository {
  private projects = new Map<string, Project>();

  findAll(userId: string): Promise<Project[]> {
    const result = Array.from(this.projects.values()).filter(
      (p) => p.userId === userId,
    );
    return Promise.resolve(result);
  }

  findById(projectId: string): Promise<Project> {
    const project = this.projects.get(projectId);
    if (!project) return Promise.reject(new Error('Project not found'));
    return Promise.resolve(project);
  }

  create(project: Project): Promise<Project> {
    const newProject = new Project({
      ...project,
      id: project.id || crypto.randomUUID(),
    });
    this.projects.set(newProject.id, newProject);
    return Promise.resolve(newProject);
  }

  update(projectId: string, project: Partial<Project>): Promise<Project> {
    const existing = this.projects.get(projectId);
    if (!existing) return Promise.reject(new Error('Project not found'));
    const updated = new Project({ ...existing, ...project });
    this.projects.set(projectId, updated);
    return Promise.resolve(updated);
  }

  delete(projectId: string): Promise<void> {
    if (!this.projects.has(projectId))
      return Promise.reject(new Error('Project not found'));
    this.projects.delete(projectId);
    return Promise.resolve();
  }
}
