import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Project } from '../../domain/model/project.model';
import { IProjectRepository } from '../../domain/types/project.repository.interface';
import { ProjectMapper } from '../mapper/project.mapper';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly db: PrismaService) {}

  async findAll(teamId: string, userId: string) {
    const userProjects = await this.db.project.findMany({
      where: { teamId, team: { ownerId: userId } },
    });
    return userProjects.map((project) => ProjectMapper.toDomain(project));
  }

  async findById(projectId: string, userId: string) {
    const project = await this.db.project.findFirstOrThrow({
      where: { id: projectId, team: { ownerId: userId } },
    });

    return ProjectMapper.toDomain(project);
  }

  async create(project: Project) {
    const data = ProjectMapper.toPersistence(project);

    const created = await this.db.project.create({ data });

    return ProjectMapper.toDomain(created);
  }

  async update(projectId: string, userId: string, project: Partial<Project>) {
    const data = ProjectMapper.toPersistence(project as Project);

    const updated = await this.db.project.updateManyAndReturn({
      where: { id: projectId, team: { ownerId: userId } },
      data,
    });

    if (updated.length === 0) {
      return null;
    }

    return ProjectMapper.toDomain(updated[0]);
  }

  async delete(projectId: string, userId: string) {
    await this.db.project.deleteMany({
      where: { id: projectId, team: { ownerId: userId } },
    });
  }
}
