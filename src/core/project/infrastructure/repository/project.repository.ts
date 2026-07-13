import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Project } from '../../domain/model/project.model';
import { IProjectRepository } from '../../domain/types/project.repository.interface';
import { ProjectMapper } from '../mapper/project.mapper';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly db: PrismaService) {}

  async findAll(userId: string): Promise<Project[]> {
    const userProjects = await this.db.project.findMany({
      where: { userId },
    });
    return userProjects.map((project) => ProjectMapper.toModel(project));
  }

  async findById(projectId: string, userId: string): Promise<Project> {
    const project = await this.db.project.findUniqueOrThrow({
      where: { id: projectId, userId },
    });

    return ProjectMapper.toModel(project);
  }

  async create(project: Project): Promise<Project> {
    const data = ProjectMapper.toPersistence(project);
    const created = await this.db.project.create({ data });

    return ProjectMapper.toModel(created);
  }

  async update(
    projectId: string,
    project: Partial<Project>,
    userId: string,
  ): Promise<Project> {
    const persistenceData = ProjectMapper.toPersistence(project as Project);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, id, ...dataToUpdate } = persistenceData;

    const updated = await this.db.project.update({
      where: { id: projectId, userId },
      data: dataToUpdate,
    });

    return ProjectMapper.toModel(updated);
  }

  async delete(projectId: string, userId: string): Promise<void> {
    await this.db.project.delete({ where: { id: projectId, userId } });
  }
}
