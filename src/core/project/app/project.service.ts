import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Project } from '../domain/model/project.model';
import {
  type IProjectRepository,
  PROJECT_REPOSITORY,
} from '../domain/types/project.repository.interface';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectMapper } from '../infrastructure/mapper/project.mapper';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async findAll(userId: string) {
    const projects = await this.projectRepository.findAll(userId);
    return projects.map((project) => ProjectMapper.toModel(project));
  }

  async findById(projectId: string, userId: string) {
    try {
      const project = await this.projectRepository.findById(projectId, userId);
      return ProjectMapper.toModel(project);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  async create(dto: CreateProjectDto, userId: string) {
    try {
      const project = new Project({
        id: crypto.randomUUID(),
        name: dto.name,
        description: dto.description ?? null,
        imageUrl: dto.imageUrl ?? null,
        userId,
        todos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const created = await this.projectRepository.create(project);
      return ProjectMapper.toModel(created);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Project with this name already exists');
      }
      throw error;
    }
  }

  async update(projectId: string, project: UpdateProjectDto, userId: string) {
    try {
      const updated = await this.projectRepository.update(
        projectId,
        project,
        userId,
      );
      return ProjectMapper.toModel(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Project not found');
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Project with this name already exists');
        }
      }
      throw error;
    }
  }

  async delete(projectId: string, userId: string) {
    try {
      await this.projectRepository.delete(projectId, userId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }
}
